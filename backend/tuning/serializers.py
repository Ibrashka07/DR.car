from rest_framework import serializers
from .models import (
    ServiceCategory, TuningService, Comment,
    ProductCategory, Product, CartItem,
    ClientCar, Project, Review, Appointment
)


class ServiceCategorySerializer(serializers.ModelSerializer):
    service_count = serializers.IntegerField(source='tuningservice_set.count', read_only=True)
    class Meta:
        model = ServiceCategory
        fields = ['id', 'title', 'description', 'icon', 'service_count']


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'author_name', 'text', 'created_at']
        read_only_fields = ['author_name', 'created_at']


class ServiceListSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source='category.title', read_only=True)
    author_name    = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = TuningService
        fields = ['id', 'title', 'price', 'duration_days', 'views',
                  'category_title', 'author_name', 'photo', 'created_at']


class ServiceDetailSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    author   = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = TuningService
        fields = '__all__'


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuningService
        fields = ['title', 'content', 'price', 'duration_days', 'category', 'photo', 'is_published']


# ─── Товары ────────────────────────────────────────────────────────────────────
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'title', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source='category.title', read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'brand', 'description', 'price', 'old_price',
                  'badge', 'photo', 'category', 'category_title', 'in_stock', 'created_at']


# ─── Корзина ───────────────────────────────────────────────────────────────────
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return float(obj.product.price) * obj.quantity

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at']


# ─── Машины клиентов ───────────────────────────────────────────────────────────
class ClientCarSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    class Meta:
        model = ClientCar
        fields = ['id', 'make', 'model', 'year', 'license_plate',
                  'status', 'status_display', 'status_note', 'photo', 'created_at']
        read_only_fields = ['created_at']


# ─── Проекты ───────────────────────────────────────────────────────────────────
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'car_make', 'car_model', 'car_year',
                  'description', 'photo_before', 'photo_after', 'photo_main', 'created_at']


# ─── Отзывы ────────────────────────────────────────────────────────────────────
class ReviewSerializer(serializers.ModelSerializer):
    author_name   = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.SerializerMethodField()

    def get_author_avatar(self, obj):
        request = self.context.get('request')
        if obj.author.avatar and request:
            return request.build_absolute_uri(obj.author.avatar.url)
        return None

    class Meta:
        model = Review
        fields = ['id', 'author_name', 'author_avatar', 'car_model',
                  'text', 'rating', 'photo', 'created_at']
        read_only_fields = ['author_name', 'author_avatar', 'created_at']


# ─── Записи ────────────────────────────────────────────────────────────────────
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'name', 'phone', 'email', 'service', 'message', 'date', 'created_at']
        read_only_fields = ['created_at']