from django.contrib import admin
from .models import ApprovalWorkflow, ApprovalStep, ApprovalRequest

admin.site.register(ApprovalWorkflow)
admin.site.register(ApprovalStep)
admin.site.register(ApprovalRequest)
