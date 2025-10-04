from rest_framework import serializers
from .models import Expense, ExpenseCategory
from approvals.serializers import ApprovalWorkflowSerializer

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'name', 'description']


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    workflow = ApprovalWorkflowSerializer(read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id', 'employee', 'employee_name', 'company', 'category',
            'category_name', 'amount', 'currency', 'amount_in_company_currency',
            'description', 'expense_date', 'receipt_image', 'ocr_data',
            'status', 'submitted_at', 'approved_at', 'rejected_at',
            'created_at', 'updated_at', 'workflow'
        ]
        read_only_fields = [
            'employee', 'company', 'status', 'submitted_at',
            'approved_at', 'rejected_at', 'amount_in_company_currency',
            'ocr_data'
        ]
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['employee'] = request.user
        validated_data['company'] = request.user.company
        return super().create(validated_data)


class ExpenseSubmitSerializer(serializers.Serializer):
    expense_id = serializers.UUIDField()


class OCRUploadSerializer(serializers.Serializer):
    receipt_image = serializers.ImageField()
