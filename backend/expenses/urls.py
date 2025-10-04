from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import signup, UserViewSet, ExpenseViewSet

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('expenses', ExpenseViewSet)

urlpatterns = [
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
