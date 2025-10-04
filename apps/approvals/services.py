from typing import List, Optional
from django.utils import timezone
from django.db import transaction
from decimal import Decimal

class ApprovalService:
    """Business logic for approval workflows"""
    
    @staticmethod
    @transaction.atomic
    def create_workflow(expense):
        """Create approval workflow based on company rules and expense amount"""
        from .models import ApprovalWorkflow, ApprovalStep, ApprovalRequest
        from companies.models import ApprovalRule
        
        # Create workflow
        workflow = ApprovalWorkflow.objects.create(
            expense=expense,
            status=ApprovalWorkflow.StatusChoices.PENDING
        )
        
        # Determine approval steps based on rules
        steps = ApprovalService._determine_approval_steps(expense)
        workflow.total_steps = len(steps)
        workflow.save()
        
        # Create approval steps
        for step_num, step_data in enumerate(steps, start=1):
            step = ApprovalStep.objects.create(
                workflow=workflow,
                step_number=step_num,
                approver_type=step_data['type'],
                approver=step_data.get('approver')
            )
            
            # Create approval request for the approver
            if step_data.get('approver'):
                ApprovalRequest.objects.create(
                    step=step,
                    approver=step_data['approver']
                )
        
        # Activate first step
        ApprovalService._activate_current_step(workflow)
        
        expense.status = expense.StatusChoices.PENDING_APPROVAL
        expense.save()
        
        return workflow
    
    @staticmethod
    def _determine_approval_steps(expense) -> List[Dict]:
        """Determine approval steps based on rules and amount"""
        from companies.models import ApprovalRule
        steps = []
        
        # Step 1: Manager approval (if manager is approver)
        if expense.employee.manager and expense.employee.manager.is_manager_approver:
            steps.append({
                'type': 'MANAGER',
                'approver': expense.employee.manager
            })
        
        # Get applicable rules
        rules = ApprovalRule.objects.filter(
            company=expense.company,
            is_active=True
        ).order_by('priority', '-threshold_amount')
        
        # Apply rules based on expense amount
        amount = expense.amount_in_company_currency or expense.amount
        
        for rule in rules:
            if rule.threshold_amount and amount >= rule.threshold_amount:
                if rule.rule_type == ApprovalRule.RuleType.SPECIFIC:
                    # Add specific approver (e.g., Finance, Director)
                    steps.append({
                        'type': rule.specific_approver_role or 'FINANCE',
                        'approver': ApprovalService._get_approver_by_role(
                            expense.company,
                            rule.specific_approver_role
                        )
                    })
                elif rule.rule_type == ApprovalRule.RuleType.PERCENTAGE:
                    # Handle percentage-based approval
                    pass  # Implement percentage logic
                elif rule.rule_type == ApprovalRule.RuleType.HYBRID:
                    # Combine both
                    pass
                
                break  # Use first matching rule
        
        # Default: If no manager, add Finance approval
        if not steps:
            steps.append({
                'type': 'FINANCE',
                'approver': ApprovalService._get_approver_by_role(
                    expense.company,
                    'FINANCE'
                )
            })
        
        return steps
    
    @staticmethod
    def _get_approver_by_role(company, role):
        """Get approver user by role"""
        from accounts.models import User
        
        # Map role to user role
        role_mapping = {
            'FINANCE': User.RoleChoices.MANAGER,
            'DIRECTOR': User.RoleChoices.MANAGER,
            'CFO': User.RoleChoices.ADMIN,
        }
        
        user_role = role_mapping.get(role, User.RoleChoices.MANAGER)
        return User.objects.filter(
            company=company,
            role=user_role
        ).first()
    
    @staticmethod
    def _activate_current_step(workflow):
        """Activate approval requests for current step"""
        from .models import ApprovalRequest
        
        current_steps = workflow.steps.filter(
            step_number=workflow.current_step
        )
        
        for step in current_steps:
            # Approval requests already created, just ensure they're pending
            step.requests.filter(
                status=ApprovalRequest.StatusChoices.PENDING
            ).update(created_at=timezone.now())
    
    @staticmethod
    @transaction.atomic
    def process_approval(approval_request, action: str, comments: str = ""):
        """Process approval/rejection"""
        from .models import ApprovalRequest, ApprovalWorkflow
        
        if action not in ['approve', 'reject']:
            raise ValueError("Action must be 'approve' or 'reject'")
        
        # Update request
        if action == 'approve':
            approval_request.status = ApprovalRequest.StatusChoices.APPROVED
            approval_request.approved_at = timezone.now()
        else:
            approval_request.status = ApprovalRequest.StatusChoices.REJECTED
            approval_request.rejected_at = timezone.now()
        
        approval_request.comments = comments
        approval_request.save()
        
        # Update step
        step = approval_request.step
        workflow = step.workflow
        expense = workflow.expense
        
        if action == 'reject':
            # Reject entire workflow
            workflow.status = ApprovalWorkflow.StatusChoices.REJECTED
            workflow.save()
            
            expense.status = expense.StatusChoices.REJECTED
            expense.rejected_at = timezone.now()
            expense.save()
            
            return workflow
        
        # Check if all requests in current step are approved
        step_requests = step.requests.all()
        all_approved = all(
            req.status == ApprovalRequest.StatusChoices.APPROVED
            for req in step_requests
        )
        
        if all_approved:
            step.is_completed = True
            step.save()
            
            # Move to next step or complete
            if workflow.current_step < workflow.total_steps:
                workflow.current_step += 1
                workflow.status = ApprovalWorkflow.StatusChoices.IN_PROGRESS
                workflow.save()
                ApprovalService._activate_current_step(workflow)
            else:
                # All steps completed - approve expense
                workflow.status = ApprovalWorkflow.StatusChoices.APPROVED
                workflow.save()
                
                expense.status = expense.StatusChoices.APPROVED
                expense.approved_at = timezone.now()
                expense.save()
        
        return workflow
    
    @staticmethod
    def get_pending_approvals(user):
        """Get pending approval requests for a user"""
        from .models import ApprovalRequest
        
        return ApprovalRequest.objects.filter(
            approver=user,
            status=ApprovalRequest.StatusChoices.PENDING
        ).select_related(
            'step__workflow__expense__employee',
            'step__workflow__expense__category'
        ).order_by('-created_at')
