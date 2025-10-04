from django.contrib.auth.models import AbstractUser
from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    default_currency = models.CharField(max_length=3)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MANAGER', 'Manager'),
        ('EMPLOYEE', 'Employee'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users', null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='EMPLOYEE')
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='team_members')

    def __str__(self):
        return f"{self.username} ({self.role})"

class Expense(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    CATEGORY_CHOICES = [
        ('TRAVEL', 'Travel'),
        ('FOOD', 'Food'),
        ('ACCOMMODATION', 'Accommodation'),
        ('SUPPLIES', 'Supplies'),
        ('OTHER', 'Other'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    date = models.DateField()
    receipt_image = models.ImageField(upload_to='receipts/', null=True, blank=True)
    vendor_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    rejection_comment = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_expenses')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.username} - {self.amount} {self.currency}"
