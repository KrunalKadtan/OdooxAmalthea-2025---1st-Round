from django.contrib import admin
from .models import Company, User, Expense

admin.site.register(Company)
admin.site.register(User)
admin.site.register(Expense)
