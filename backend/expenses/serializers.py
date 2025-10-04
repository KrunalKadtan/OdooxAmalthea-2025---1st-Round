from rest_framework import serializers
from .models import Company, User, Expense
import requests

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'default_currency', 'country', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    manager_name = serializers.CharField(source='manager.username', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'company', 'company_name', 'manager', 'manager_name']
        extra_kwargs = {'password': {'write_only': True}}

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    company_name = serializers.CharField()
    country = serializers.CharField()

    def create(self, validated_data):
        # Fetch currency from country API
        country = validated_data['country']
        try:
            response = requests.get(f'https://restcountries.com/v3.1/name/{country}?fields=currencies')
            currencies = response.json()[0]['currencies']
            default_currency = list(currencies.keys())[0]
        except:
            default_currency = 'USD'
        
        # Create company
        company = Company.objects.create(
            name=validated_data['company_name'],
            country=country,
            default_currency=default_currency
        )
        
        # Create admin user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            company=company,
            role='ADMIN'
        )
        
        return user

class ExpenseSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    converted_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['employee', 'status', 'reviewed_by', 'reviewed_at']
    
    def get_converted_amount(self, obj):
        request = self.context.get('request')
        if not request or not request.user.company:
            return None
        
        target_currency = request.user.company.default_currency
        if obj.currency == target_currency:
            return {'amount': float(obj.amount), 'currency': target_currency}
        
        try:
            response = requests.get(f'https://api.exchangerate-api.com/v4/latest/{obj.currency}')
            rates = response.json()['rates']
            converted = float(obj.amount) * rates.get(target_currency, 1)
            return {'amount': round(converted, 2), 'currency': target_currency}
        except:
            return None
