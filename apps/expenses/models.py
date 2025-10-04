from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class ExpenseCategory(models.Model):
    """Expense categories"""
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='expense_categories'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'expense_categories'
        verbose_name_plural = 'Expense Categories'
        unique_together = ['name', 'company']
    
    def __str__(self):
        return self.name


class Expense(models.Model):
    """Main expense model"""
    
    class StatusChoices(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        SUBMITTED = 'SUBMITTED', 'Submitted'
        PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        REIMBURSED = 'REIMBURSED', 'Reimbursed'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        related_name='expenses'
    )
    
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    currency = models.CharField(max_length=3, default='USD')
    amount_in_company_currency = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    description = models.TextField()
    expense_date = models.DateField()
    receipt_image = models.ImageField(
        upload_to='receipts/%Y/%m/',
        null=True,
        blank=True
    )
    ocr_data = models.JSONField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT
    )
    
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expenses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee', 'status']),
            models.Index(fields=['company', 'status']),
            models.Index(fields=['expense_date']),
        ]
    
    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.amount} {self.currency}"
    
    def convert_currency(self):
        """Convert expense amount to company currency"""
        from .services import CurrencyConverter
        
        if self.currency != self.company.currency:
            converter = CurrencyConverter()
            self.amount_in_company_currency = converter.convert(
                self.amount,
                self.currency,
                self.company.currency
            )
        else:
            self.amount_in_company_currency = self.amount
