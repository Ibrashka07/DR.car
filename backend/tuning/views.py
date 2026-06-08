from rest_framework import viewsets, permissions, filters, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ServiceCategory, TuningService, Comment,
    ProductCategory, Product, CartItem,
    ClientCar, Project, Review, Appointment
)
from .serializers import (
    ServiceCategorySerializer, ServiceListSerializer,
    ServiceDetailSerializer, ServiceCreateUpdateSerializer, CommentSerializer,
    ProductCategorySerializer, ProductSerializer, CartItemSerializer,
    ClientCarSerializer, ProjectSerializer, ReviewSerializer, AppointmentSerializer
)
from .permissions import IsAuthorOrReadOnly


# ─── Услуги ────────────────────────────────────────────────────────────────────
class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]


class TuningServiceViewSet(viewsets.ModelViewSet):
    queryset = TuningService.objects.filter(is_published=True).select_related('category', 'author')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views', 'price']

    def get_serializer_class(self):
        if self.action == 'list': return ServiceListSerializer
        if self.action in ['create', 'update', 'partial_update']: return ServiceCreateUpdateSerializer
        return ServiceDetailSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']: return [IsAuthorOrReadOnly()]
        if self.action == 'create': return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        obj = self.get_object()
        obj.views += 1
        obj.save(update_fields=['views'])
        return Response({'views': obj.views})

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        service = self.get_object()
        if request.method == 'GET':
            return Response(CommentSerializer(service.comments.all(), many=True).data)
        if not request.user.is_authenticated:
            return Response({'detail': 'Требуется авторизация.'}, status=401)
        s = CommentSerializer(data=request.data)
        if s.is_valid():
            s.save(author=request.user, service=service)
            return Response(s.data, status=201)
        return Response(s.errors, status=400)


# ─── Товары ────────────────────────────────────────────────────────────────────
class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(in_stock=True).select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'brand', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category__slug=cat)
        return qs


# ─── Корзина ───────────────────────────────────────────────────────────────────
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        existing = CartItem.objects.filter(user=self.request.user, product=product).first()
        if existing:
            existing.quantity += serializer.validated_data.get('quantity', 1)
            existing.save()
        else:
            serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def count(self, request):
        total = sum(i.quantity for i in CartItem.objects.filter(user=request.user))
        return Response({'count': total})


# ─── Машины клиентов ───────────────────────────────────────────────────────────
class ClientCarViewSet(viewsets.ModelViewSet):
    serializer_class = ClientCarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ClientCar.objects.all().select_related('owner')
        return ClientCar.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ─── Проекты ───────────────────────────────────────────────────────────────────
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(is_published=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]


# ─── Отзывы ────────────────────────────────────────────────────────────────────
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_published=True).select_related('author')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']: return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ─── Записи на приём ───────────────────────────────────────────────────────────
class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.AllowAny]