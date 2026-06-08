from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """Редактировать может только автор записи."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """Изменять могут только администраторы."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff