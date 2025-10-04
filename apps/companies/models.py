from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Company(models.Model):
    """Company model with multi-currency support"""
    
    name = models.CharField(max_length=255, unique=True)
    currency = models.CharField(max_length=3, default='USD')
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'companies'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return self.name


class ApprovalRule(models.Model):
    """Flexible approval rules for conditional workflows"""
    
    class RuleType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage Based'
        SPECIFIC = 'SPECIFIC', 'Specific Approver'
        HYBRID = 'HYBRID', 'Hybrid'
    
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='approval_rules'
    )
    name = models.CharField(max_length=255)
    rule_type = models.CharField(
        max_length=20,
        choices=RuleType.choices
    )
    threshold_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    percentage_required = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    specific_approver_role = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_rules'
        ordering = ['priority', '-threshold_amount']
        indexes = [
            models.Index(fields=['company', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.company.name} - {self.name}"
