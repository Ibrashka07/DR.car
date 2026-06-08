from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories',        views.ServiceCategoryViewSet)
router.register(r'services',          views.TuningServiceViewSet)
router.register(r'product-categories', views.ProductCategoryViewSet)
router.register(r'products',          views.ProductViewSet)
router.register(r'cart',              views.CartViewSet, basename='cart')
router.register(r'my-cars',           views.ClientCarViewSet, basename='my-cars')
router.register(r'projects',          views.ProjectViewSet)
router.register(r'reviews',           views.ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('appointments/', views.AppointmentCreateView.as_view(), name='appointments'),
]