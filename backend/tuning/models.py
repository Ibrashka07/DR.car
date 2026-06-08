from django.db import models
from django.conf import settings


# ─── Категории услуг ───────────────────────────────────────────────────────────
class ServiceCategory(models.Model):
    title = models.CharField(max_length=150, db_index=True, verbose_name='Категория')
    description = models.TextField(verbose_name='Описание', blank=True)
    icon = models.CharField(max_length=50, verbose_name='Иконка', blank=True)

    def __str__(self): return self.title
    class Meta:
        verbose_name = 'Категория услуг'
        verbose_name_plural = 'Категории услуг'
        ordering = ['title']


# ─── Услуги тюнинга ────────────────────────────────────────────────────────────
class TuningService(models.Model):
    title       = models.CharField(max_length=200, verbose_name='Название')
    content     = models.TextField(verbose_name='Описание')
    price       = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Цена')
    duration_days = models.PositiveIntegerField(default=1, verbose_name='Срок (дней)')
    photo       = models.ImageField(upload_to='services/%Y/%m/%d', blank=True, verbose_name='Фото')
    is_published = models.BooleanField(default=True, verbose_name='Опубликовано')
    views       = models.IntegerField(default=0, verbose_name='Просмотры')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    category    = models.ForeignKey(ServiceCategory, on_delete=models.PROTECT, verbose_name='Категория')
    author      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='Автор')

    def __str__(self): return self.title
    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['-created_at']


# ─── Комментарии к услугам ─────────────────────────────────────────────────────
class Comment(models.Model):
    service    = models.ForeignKey(TuningService, on_delete=models.CASCADE, related_name='comments')
    author     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text       = models.TextField(verbose_name='Текст')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.author} → {self.service}'
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']


# ─── Категории товаров ─────────────────────────────────────────────────────────
class ProductCategory(models.Model):
    title = models.CharField(max_length=150, verbose_name='Название')
    slug  = models.SlugField(unique=True, verbose_name='Slug')

    def __str__(self): return self.title
    class Meta:
        verbose_name = 'Категория товаров'
        verbose_name_plural = 'Категории товаров'


# ─── Товары ────────────────────────────────────────────────────────────────────
class Product(models.Model):
    BADGE_CHOICES = [('hit', 'Хит'), ('new', 'Новинка'), ('sale', 'Акция'), ('', 'Нет')]

    title         = models.CharField(max_length=200, verbose_name='Название')
    brand         = models.CharField(max_length=100, verbose_name='Бренд', blank=True)
    description   = models.TextField(verbose_name='Описание', blank=True)
    price         = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    old_price     = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Старая цена')
    badge         = models.CharField(max_length=10, choices=BADGE_CHOICES, blank=True, verbose_name='Плашка')
    photo         = models.ImageField(upload_to='products/%Y/%m/%d', blank=True, verbose_name='Фото')
    category      = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, verbose_name='Категория')
    in_stock      = models.BooleanField(default=True, verbose_name='В наличии')
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.title
    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']


# ─── Корзина ───────────────────────────────────────────────────────────────────
class CartItem(models.Model):
    user     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.user} — {self.product} x{self.quantity}'
    class Meta:
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Корзина'
        unique_together = ('user', 'product')


# ─── Машины клиентов ───────────────────────────────────────────────────────────
class ClientCar(models.Model):
    STATUS_CHOICES = [
        ('waiting_parts', 'Ожидает запчасти'),
        ('on_lift',       'На подъёмнике'),
        ('painting',      'На участке покраски'),
        ('ready',         'Готов к выдаче'),
        ('done',          'Выдан'),
    ]
    owner       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cars')
    make        = models.CharField(max_length=100, verbose_name='Марка')
    model       = models.CharField(max_length=100, verbose_name='Модель')
    year        = models.PositiveIntegerField(verbose_name='Год')
    license_plate = models.CharField(max_length=20, verbose_name='Гос. номер', blank=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting_parts')
    status_note = models.CharField(max_length=255, blank=True, verbose_name='Примечание к статусу')
    photo       = models.ImageField(upload_to='cars/%Y/%m/%d', blank=True, verbose_name='Фото')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.make} {self.model} ({self.owner})'
    class Meta:
        verbose_name = 'Автомобиль клиента'
        verbose_name_plural = 'Автомобили клиентов'


# ─── Проекты (портфолио) ───────────────────────────────────────────────────────
class Project(models.Model):
    title       = models.CharField(max_length=200, verbose_name='Название')
    car_make    = models.CharField(max_length=100, verbose_name='Марка')
    car_model   = models.CharField(max_length=100, verbose_name='Модель')
    car_year    = models.PositiveIntegerField(verbose_name='Год')
    description = models.TextField(verbose_name='Описание работ')
    photo_before = models.ImageField(upload_to='projects/%Y/%m/%d', blank=True, verbose_name='До')
    photo_after  = models.ImageField(upload_to='projects/%Y/%m/%d', blank=True, verbose_name='После')
    photo_main   = models.ImageField(upload_to='projects/%Y/%m/%d', blank=True, verbose_name='Главное фото')
    is_published = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.title
    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-created_at']


# ─── Отзывы ────────────────────────────────────────────────────────────────────
class Review(models.Model):
    author     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Автор')
    car_model  = models.CharField(max_length=150, verbose_name='Модель авто')
    text       = models.TextField(verbose_name='Текст отзыва')
    rating     = models.PositiveSmallIntegerField(default=5, verbose_name='Оценка (1-5)')
    photo      = models.ImageField(upload_to='reviews/%Y/%m/%d', blank=True, verbose_name='Фото авто')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.author} — {self.car_model}'
    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']


# ─── Заявки на запись ──────────────────────────────────────────────────────────
class Appointment(models.Model):
    name    = models.CharField(max_length=150, verbose_name='Имя')
    phone   = models.CharField(max_length=20, verbose_name='Телефон')
    email   = models.EmailField(blank=True, verbose_name='Email')
    service = models.CharField(max_length=200, verbose_name='Услуга')
    message = models.TextField(blank=True, verbose_name='Комментарий')
    date    = models.DateField(verbose_name='Желаемая дата')
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False, verbose_name='Обработано')

    def __str__(self): return f'{self.name} — {self.service} ({self.date})'
    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'
        ordering = ['-created_at']