from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .models import Company, User, Expense
from .serializers import CompanySerializer, UserSerializer, SignupSerializer, ExpenseSerializer
from .ocr_service import extract_receipt_data

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER']

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return User.objects.filter(company=self.request.user.company)
    
    def create(self, request):
        data = request.data.copy()
        password = data.pop('password', None)
        
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=password or 'changeme123',
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            company=request.user.company,
            role=data.get('role', 'EMPLOYEE'),
            manager_id=data.get('manager')
        )
        
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Expense.objects.filter(employee__company=user.company)
        elif user.role == 'MANAGER':
            return Expense.objects.filter(employee__manager=user)
        else:
            return Expense.objects.filter(employee=user)
    
    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)
    
    @action(detail=False, methods=['post'])
    def ocr_scan(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.FILES['image']
        extracted_data = extract_receipt_data(image)
        return Response(extracted_data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'APPROVED'
        expense.reviewed_by = request.user
        expense.reviewed_at = timezone.now()
        expense.save()
        return Response(ExpenseSerializer(expense, context={'request': request}).data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def reject(self, request, pk=None):
        expense = self.get_object()
        comment = request.data.get('comment', '')
        if not comment:
            return Response({'error': 'Rejection comment required'}, status=status.HTTP_400_BAD_REQUEST)
        
        expense.status = 'REJECTED'
        expense.rejection_comment = comment
        expense.reviewed_by = request.user
        expense.reviewed_at = timezone.now()
        expense.save()
        return Response(ExpenseSerializer(expense, context={'request': request}).data)
