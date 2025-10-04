from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
import uuid

class ApprovalWorkflow(models.Model):
    """Manages the approval workflow for each expense"""
    
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expense = models.OneToOneField(
        'expenses.Expense',
        on_delete=models.CASCADE,
        related_name='workflow'
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )
    current_step = models.IntegerField(default=1)
    total_steps = models.IntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_workflows'
    
    def __str__(self):
        return f"Workflow for Expense {self.expense.id}"


class ApprovalStep(models.Model):
    """Individual approval steps in the workflow"""
    
    class ApproverType(models.TextChoices):
        MANAGER = 'MANAGER', 'Manager'
        FINANCE = 'FINANCE', 'Finance'
        DIRECTOR = 'DIRECTOR', 'Director'
        CFO = 'CFO', 'CFO'
        CUSTOM = 'CUSTOM', 'Custom'
    
    workflow = models.ForeignKey(
        ApprovalWorkflow,
        on_delete=models.CASCADE,
        related_name='steps'
    )
    step_number = models.IntegerField(validators=[MinValueValidator(1)])
    approver_type = models.CharField(
        max_length=20,
        choices=ApproverType.choices
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='approval_steps',
        null=True,
        blank=True
    )
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'approval_steps'
        ordering = ['step_number']
        unique_together = ['workflow', 'step_number']
    
    def __str__(self):
        return f"Step {self.step_number} - {self.approver_type}"


class ApprovalRequest(models.Model):
    """Individual approval requests for each approver"""
    
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    step = models.ForeignKey(
        ApprovalStep,
        on_delete=models.CASCADE,
        related_name='requests'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='approval_requests'
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )
    comments = models.TextField(blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_requests'
        indexes = [
            models.Index(fields=['approver', 'status']),
        ]
    
    def __str__(self):
        return f"Request for {self.approver.get_full_name()} - {self.status}"
