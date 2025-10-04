from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import ApprovalRequest, ApprovalWorkflow
from .serializers import ApprovalRequestSerializer, ApprovalActionSerializer
from .services import ApprovalService
from .permissions import IsApprover

class ApprovalViewSet(viewsets.ReadOnlyModelViewSet):
    """Approval request management"""
    
    serializer_class = ApprovalRequestSerializer
    permission_classes = [IsAuthenticated, IsApprover]
    
    def get_queryset(self):
        return ApprovalService.get_pending_approvals(self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an expense"""
        approval_request = self.get_object()
        
        serializer = ApprovalActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        comments = serializer.validated_data.get('comments', '')
        
        workflow = ApprovalService.process_approval(
            approval_request,
            'approve',
            comments
        )
        
        return Response({
            'message': 'Expense approved successfully',
            'workflow_status': workflow.status
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an expense"""
        approval_request = self.get_object()
        
        serializer = ApprovalActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        comments = serializer.validated_data.get('comments', '')
        
        workflow = ApprovalService.process_approval(
            approval_request,
            'reject',
            comments
        )
        
        return Response({
            'message': 'Expense rejected',
            'workflow_status': workflow.status
        })
