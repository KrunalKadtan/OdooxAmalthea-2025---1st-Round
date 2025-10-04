from rest_framework import permissions

class IsEmployeeOrManager(permissions.BasePermission):
    """Allow employees to manage their own expenses"""
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Employees can only access their own expenses
        if user.role == 'EMPLOYEE':
            return obj.employee == user
        
        # Managers can access subordinates' expenses
        if user.role == 'MANAGER':
            subordinate_ids = user.subordinates.values_list('id', flat=True)
            return obj.employee.id in subordinate_ids or obj.employee == user
        
        # Admins can access all company expenses
        if user.role == 'ADMIN':
            return obj.company == user.company
        
        return False
