from rest_framework import permissions

class IsApprover(permissions.BasePermission):
    """Only approvers can access approval requests"""
    
    def has_permission(self, request, view):
        return request.user.role in ['MANAGER', 'ADMIN']
    
    def has_object_permission(self, request, view, obj):
        return obj.approver == request.user
