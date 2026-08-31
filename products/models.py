from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class ProductType(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='product_types'
    )

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Product(models.Model):
    product_type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
        related_name='products',
        null=True,
        blank=True
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    description = models.TextField(blank=True)

    # Main product image
    image = models.ImageField(
        upload_to='products/'
    )

    # Main/base product information
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    # Colour is OPTIONAL.
    # It is NOT the main identity of the product.
    color = models.CharField(
        max_length=100,
        blank=True
    )

    # Optional image for this particular variant
    image = models.ImageField(
        upload_to='products/variants/',
        blank=True,
        null=True
    )

    # Optional variant-specific price
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    # Optional variant-specific stock
    stock = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    available = models.BooleanField(
        default=True
    )

    def __str__(self):
        if self.color:
            return f"{self.product.name} - {self.color}"

        return f"{self.product.name} - Variant"


# =========================================================
# ORDER
# =========================================================

class Order(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ('cod', 'Cash on Delivery'),
        ('online', 'Online Payment'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    # =====================================================
    # CUSTOMER INFORMATION
    # =====================================================
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='orders'
)
    full_name = models.CharField(
        max_length=200
    )

    mobile = models.CharField(
        max_length=15
    )

    email = models.EmailField()


    # =====================================================
    # DELIVERY ADDRESS
    # =====================================================

    address = models.TextField()

    city = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    pin = models.CharField(
        max_length=10
    )


    # =====================================================
    # PRICE INFORMATION
    # =====================================================

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    delivery_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    grand_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    # =====================================================
    # PAYMENT
    # =====================================================

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='cod'
    )

        # =====================================================
    # PAYMENT STATUS
    # =====================================================

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )


    # =====================================================
    # RAZORPAY INFORMATION
    # =====================================================

    razorpay_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_index=True
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    # =====================================================
    # ORDER STATUS
    # =====================================================

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )


    # =====================================================
    # DATE & TIME
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"


# =========================================================
# ORDER ITEM
# =========================================================

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Keep product name even if product is later deleted
    product_name = models.CharField(
        max_length=200
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    item_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    def __str__(self):
        return f"{self.product_name} × {self.quantity}"
    # =========================================================
# SAVED ADDRESS
# =========================================================

class SavedAddress(models.Model):

    user = models.OneToOneField(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='saved_address'
    )

    full_name = models.CharField(
        max_length=200
    )

    mobile = models.CharField(
        max_length=15
    )

    address = models.TextField()

    city = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    pin = models.CharField(
        max_length=10
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} - Saved Address"