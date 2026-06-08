from django.contrib import admin
from .models import (
    ServiceCategory, TuningService, Comment,
    ProductCategory, Product, CartItem,
    ClientCar, Project, Review, Appointment
)

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    search_fields = ('title',)

@admin.register(TuningService)
class TuningServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'is_published', 'views')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'category')
    search_fields = ('title',)
    readonly_fields = ('views',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'service', 'created_at')

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'brand', 'category', 'price', 'old_price', 'badge', 'in_stock')
    list_editable = ('in_stock', 'badge')
    list_filter = ('category', 'badge', 'in_stock')
    search_fields = ('title', 'brand')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'added_at')

@admin.register(ClientCar)
class ClientCarAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'make', 'model', 'year', 'status')
    list_editable = ('status',)
    list_filter = ('status',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'car_make', 'car_model', 'car_year', 'is_published')
    list_editable = ('is_published',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'car_model', 'rating', 'is_published')
    list_editable = ('is_published',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'service', 'date', 'is_processed')
    list_editable = ('is_processed',)