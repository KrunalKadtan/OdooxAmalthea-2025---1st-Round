from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, ExpenseCategoryViewSet

router = DefaultRouter()
router.register('', ExpenseViewSet, basename='expense')
router.register('categories', ExpenseCategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
