from decimal import Decimal
from typing import Dict, Optional
from django.utils import timezone
import requests
from django.conf import settings

class CurrencyConverter:
    """Currency conversion service using external API"""
    
    def __init__(self):
        self.api_url = "https://api.exchangerate-api.com/v4/latest/"
    
    def get_exchange_rate(self, from_currency: str, to_currency: str) -> Decimal:
        """Get exchange rate between two currencies"""
        try:
            response = requests.get(f"{self.api_url}{from_currency}")
            data = response.json()
            rate = data['rates'].get(to_currency)
            return Decimal(str(rate)) if rate else Decimal('1.0')
        except Exception:
            return Decimal('1.0')
    
    def convert(
        self,
        amount: Decimal,
        from_currency: str,
        to_currency: str
    ) -> Decimal:
        """Convert amount from one currency to another"""
        if from_currency == to_currency:
            return amount
        
        rate = self.get_exchange_rate(from_currency, to_currency)
        return (amount * rate).quantize(Decimal('0.01'))


class ExpenseService:
    """Business logic for expense management"""
    
    @staticmethod
    def submit_expense(expense):
        """Submit expense for approval"""
        from approvals.services import ApprovalService
        
        expense.status = expense.StatusChoices.SUBMITTED
        expense.submitted_at = timezone.now()
        
        # Convert currency if needed
        expense.convert_currency()
        expense.save()
        
        # Create approval workflow
        ApprovalService.create_workflow(expense)
        
        return expense
    
    @staticmethod
    def get_employee_expenses(user, status=None):
        """Get expenses for an employee"""
        from .models import Expense
        
        queryset = Expense.objects.filter(employee=user)
        if status:
            queryset = queryset.filter(status=status)
        return queryset.select_related('category', 'company')
    
    @staticmethod
    def get_expense_statistics(user):
        """Get expense statistics for user"""
        from django.db.models import Sum, Count, Avg
        from .models import Expense
        
        expenses = Expense.objects.filter(employee=user)
        
        return {
            'total_expenses': expenses.count(),
            'total_amount': expenses.aggregate(Sum('amount_in_company_currency'))['amount_in_company_currency__sum'] or 0,
            'approved_count': expenses.filter(status='APPROVED').count(),
            'pending_count': expenses.filter(status='PENDING_APPROVAL').count(),
            'rejected_count': expenses.filter(status='REJECTED').count(),
            'average_amount': expenses.aggregate(Avg('amount_in_company_currency'))['amount_in_company_currency__avg'] or 0,
        }
