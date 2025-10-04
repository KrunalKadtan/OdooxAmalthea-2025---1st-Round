from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Expense, ExpenseCategory
from .serializers import (
    ExpenseSerializer,
    ExpenseCategorySerializer,
    ExpenseSubmitSerializer,
    OCRUploadSerializer
)
from .services import ExpenseService
from ocr.services import OCRService
from .permissions import IsEmployeeOrManager

class ExpenseViewSet(viewsets.ModelViewSet):
    """Expense CRUD operations"""
    
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrManager]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'EMPLOYEE':
            return Expense.objects.filter(employee=user)
        elif user.role == 'MANAGER':
            # Managers see their own + subordinates' expenses
            subordinate_ids = user.subordinates.values_list('id', flat=True)
            return Expense.objects.filter(
                employee__in=[user.id] + list(subordinate_ids)
            )
        elif user.role == 'ADMIN':
            return Expense.objects.filter(company=user.company)
        
        return Expense.objects.none()
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit expense for approval"""
        expense = self.get_object()
        
        if expense.status != Expense.StatusChoices.DRAFT:
            return Response(
                {'error': 'Only draft expenses can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ExpenseService.submit_expense(expense)
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get expense statistics for current user"""
        stats = ExpenseService.get_expense_statistics(request.user)
        return Response(stats)
    
    @action(detail=False, methods=['post'])
    def ocr_upload(self, request):
        """Upload receipt for OCR processing"""
        serializer = OCRUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        image = serializer.validated_data['receipt_image']
        
        # Save temporary file
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            for chunk in image.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
        
        # Process with OCR
        ocr_service = OCRService()
        ocr_data = ocr_service.process_receipt(tmp_file_path)
        
        # Clean up
        import os
        os.unlink(tmp_file_path)
        
        return Response(ocr_data)


class ExpenseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Expense categories"""
    
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ExpenseCategory.objects.filter(
            company=self.request.user.company,
            is_active=True
        )
