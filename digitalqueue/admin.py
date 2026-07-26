'''
from django.contrib import admin
from django.contrib import admin
from .models import Organization, Service, Customer, Counter, Token

admin.site.register(Organization)
admin.site.register(Service)
admin.site.register(Customer)
admin.site.register(Counter)
admin.site.register(Token)
# Register your models here.
'''
from django.contrib import admin
from .models import Organization, Service, Customer, Counter, Token


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "address")
    search_fields = ("name",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "service_name", "organization")
    search_fields = ("service_name",)
    list_filter = ("organization",)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "created_at")
    search_fields = ("name", "phone")


@admin.register(Counter)
class CounterAdmin(admin.ModelAdmin):
    list_display = ("id", "counter_name", "organization", "status")
    list_filter = ("organization", "status")


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = (
        "token_number",
        "customer",
        "service",
        "status",
        "counter",
        "created_at"
    )
    search_fields = ("token_number",)
    list_filter = ("status", "service", "organization")