from django.contrib import admin
from .models import (
    Category,
    ProductType,
    Product,
    ProductVariant,
    Order,
    OrderItem,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'slug',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'slug',
    )

    list_filter = (
        'category',
    )

    search_fields = (
        'name',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }


# =========================================================
# PRODUCT VARIANT INLINE
# =========================================================

class ProductVariantInline(admin.TabularInline):

    model = ProductVariant

    extra = 0


# =========================================================
# ORDER ITEM INLINE
# =========================================================

class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 0

    readonly_fields = (
        'product',
        'product_name',
        'quantity',
        'price',
        'item_total',
    )


# =========================================================
# PRODUCT ADMIN
# =========================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'get_category',
        'product_type',
        'price',
        'stock',
        'available',
        'created_at',
    )

    list_filter = (
        'product_type__category',
        'product_type',
        'available',
    )

    search_fields = (
        'name',
        'description',
        'product_type__name',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }

    inlines = [
        ProductVariantInline
    ]

    @admin.display(description='Category')
    def get_category(self, obj):

        if obj.product_type and obj.product_type.category:
            return obj.product_type.category.name

        return 'No Category'


# =========================================================
# PRODUCT VARIANT ADMIN
# =========================================================

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):

    list_display = (
        'product',
        'color',
        'price',
        'stock',
        'available',
    )

    list_filter = (
        'available',
        'color',
    )

    search_fields = (
        'product__name',
        'color',
    )


# =========================================================
# ORDER ADMIN
# =========================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'full_name',
        'mobile',
        'grand_total',
        'payment_method',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_method',
        'created_at',
    )

    search_fields = (
        'full_name',
        'mobile',
        'email',
        'city',
        'pin',
    )

    readonly_fields = (
        'created_at',
    )

    inlines = [
        OrderItemInline
    ]

    ordering = (
        '-created_at',
    )