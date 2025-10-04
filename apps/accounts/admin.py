# apps/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'company', 'manager']
    list_filter = ['role', 'company']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'company', 'manager', 'is_manager_approver')}),
    )
