from django.shortcuts import render, get_object_or_404
from .models import Product, Category, ProductType ,Order, OrderItem , SavedAddress
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
import json
from django.http import JsonResponse
from django.db import transaction
from decimal import Decimal

from .forms import CustomerSignupForm

def home(request):
    products = Product.objects.filter(
        available=True
    ).order_by('-created_at')

    return render(
        request,
        'products/home.html',
        {'products': products}
    )


def category_products(request, slug):
    category = get_object_or_404(
        Category,
        slug=slug
    )

    product_types = ProductType.objects.filter(
        category=category
    )

    products = Product.objects.filter(
        product_type__in=product_types,
        available=True
    ).order_by('-created_at')

    return render(
        request,
        'products/category_products.html',
        {
            'category': category,
            'product_types': product_types,
            'products': products,
        }
    )


def product_type_products(request, slug):
    product_type = get_object_or_404(
        ProductType,
        slug=slug
    )

    products = Product.objects.filter(
        product_type=product_type,
        available=True
    ).order_by('-created_at')

    return render(
        request,
        'products/product_type_products.html',
        {
            'product_type': product_type,
            'products': products,
        }
    )

def product_detail(request, slug):

    product = get_object_or_404(
        Product,
        slug=slug
    )

    return render(
        request,
        'products/product_detail.html',
        {
            'product': product
        }
    )
def cart(request):
    return render(request, 'products/cart.html')

def privacy_policy(request):
    return render(request, 'products/privacy_policy.html')


def terms_conditions(request):
    return render(request, 'products/terms_conditions.html')


def shipping_policy(request):
    return render(request, 'products/shipping_policy.html')


def returns_policy(request):
    return render(request, 'products/returns_policy.html')

def contact(request):
    return render(
        request,
        'products/contact.html'
    )
def about(request):
    return render(
        request,
        'products/about.html'
    )
def customer_signup(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":

        form = CustomerSignupForm(request.POST)

        if form.is_valid():

            user = form.save()

            login(request, user)

            return redirect("home")

    else:
        form = CustomerSignupForm()

    return render(
        request,
        "products/signup.html",
        {"form": form}
    )


class CustomerLoginView(LoginView):

    template_name = "products/login.html"

    redirect_authenticated_user = True

    def get_success_url(self):
        return "/account/"
    

def customer_logout(request):

    logout(request)

    return redirect("home")
def customer_account(request):

    return render(
        request,
        "products/account.html"
    )
def order_tracking(request):

    order = None
    error = None

    if request.method == "POST":

        order_id = request.POST.get("order_id", "").strip()

        if not order_id:

            error = "Please enter your Order ID."

        else:

            try:

                order = Order.objects.get(
                    id=order_id
                )

            except Order.DoesNotExist:

                error = "Order not found. Please check your Order ID."

            except ValueError:

                error = "Please enter a valid Order ID."

    return render(
        request,
        "products/order_tracking.html",
        {
            "order": order,
            "error": error
        }
    )
def saved_address(request):

    if not request.user.is_authenticated:
        return redirect("login")

    address = SavedAddress.objects.filter(
        user=request.user
    ).first()

    if request.method == "POST":

        full_name = request.POST.get("full_name", "").strip()
        mobile = request.POST.get("mobile", "").strip()
        address_text = request.POST.get("address", "").strip()
        city = request.POST.get("city", "").strip()
        state = request.POST.get("state", "").strip()
        pin = request.POST.get("pin", "").strip()

        if not all([
            full_name,
            mobile,
            address_text,
            city,
            state,
            pin
        ]):

            return render(
                request,
                "products/saved_address.html",
                {
                    "address": address,
                    "error": "Please fill in all fields."
                }
            )

        if address:

            address.full_name = full_name
            address.mobile = mobile
            address.address = address_text
            address.city = city
            address.state = state
            address.pin = pin

            address.save()

        else:

            SavedAddress.objects.create(

                user=request.user,

                full_name=full_name,

                mobile=mobile,

                address=address_text,

                city=city,

                state=state,

                pin=pin
            )

        return redirect("saved_address")

    return render(
        request,
        "products/saved_address.html",
        {
            "address": address
        }
    )
def my_orders(request):

    if not request.user.is_authenticated:
        return redirect("login")

    orders = Order.objects.filter(
        user=request.user
    ).prefetch_related(
        'items'
    ).order_by(
        '-created_at'
    )

    return render(
        request,
        "products/my_orders.html",
        {
            "orders": orders
        }
    )
def checkout(request):

    # =====================================================
    # SHOW CHECKOUT PAGE
    # =====================================================

    if request.method == "GET":

        return render(
            request,
            'products/checkout.html'
        )


    # =====================================================
    # RECEIVE ORDER FROM CHECKOUT
    # =====================================================

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            customer = data.get("customer", {})
            address = data.get("address", {})
            items = data.get("items", [])

            payment_method = data.get(
                "paymentMethod",
                "cod"
            )


            # =================================================
            # BASIC VALIDATION
            # =================================================

            if not customer.get("fullName"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Full name is required."
                    },
                    status=400
                )


            if not customer.get("mobile"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Mobile number is required."
                    },
                    status=400
                )


            if not customer.get("email"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Email is required."
                    },
                    status=400
                )


            if not address.get("fullAddress"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Address is required."
                    },
                    status=400
                )


            if not address.get("city"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "City is required."
                    },
                    status=400
                )


            if not address.get("state"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "State is required."
                    },
                    status=400
                )


            if not address.get("pin"):
                return JsonResponse(
                    {
                        "success": False,
                        "message": "PIN code is required."
                    },
                    status=400
                )


            # =================================================
            # CHECK CART
            # =================================================

            if not items:

                return JsonResponse(
                    {
                        "success": False,
                        "message": "Your cart is empty."
                    },
                    status=400
                )


            # =================================================
            # CREATE ORDER + STOCK MANAGEMENT
            # =================================================

            with transaction.atomic():

                subtotal = Decimal("0.00")


                # -------------------------------------------------
                # CHECK EVERY PRODUCT STOCK
                # -------------------------------------------------

                checked_items = []


                for item in items:

                    product_slug = item.get("id")

                    quantity = int(
                        item.get("quantity", 1)
                    )


                    if quantity <= 0:

                        return JsonResponse(
                            {
                                "success": False,
                                "message":
                                    "Invalid product quantity."
                            },
                            status=400
                        )


                    # Lock product row while checking stock
                    product = Product.objects.select_for_update().filter(
                        slug=product_slug,
                        available=True
                    ).first()


                    if not product:

                        return JsonResponse(
                            {
                                "success": False,
                                "message":
                                    "Product is no longer available."
                            },
                            status=400
                        )


                    # -------------------------------------------------
                    # STOCK CHECK
                    # -------------------------------------------------

                    if product.stock < quantity:

                        return JsonResponse(
                            {
                                "success": False,
                                "message":
                                    f"Only {product.stock} "
                                    f"item(s) of "
                                    f"'{product.name}' "
                                    f"are available."
                            },
                            status=400
                        )


                    # -------------------------------------------------
                    # USE DATABASE PRICE
                    # -------------------------------------------------

                    price = product.price

                    item_total = (
                        price * quantity
                    )

                    subtotal += item_total


                    checked_items.append(
                        {
                            "product": product,
                            "quantity": quantity,
                            "price": price,
                            "item_total": item_total,
                        }
                    )


                # =================================================
                # DELIVERY CHARGE
                # =================================================

                delivery = Decimal("50.00")


                grand_total = (
                    subtotal + delivery
                )


                # =================================================
                # CREATE ORDER
                # =================================================

                order = Order.objects.create(
                    user=
                        request.user if request.user.is_authenticated else None,
                    full_name=
                        customer.get("fullName"),

                    mobile=
                        customer.get("mobile"),

                    email=
                        customer.get("email"),

                    address=
                        address.get("fullAddress"),

                    city=
                        address.get("city"),

                    state=
                        address.get("state"),

                    pin=
                        address.get("pin"),

                    subtotal=
                        subtotal,

                    delivery_charge=
                        delivery,

                    grand_total=
                        grand_total,

                    payment_method=
                        payment_method,

                    status=
                        "pending"
                )


                # =================================================
                # CREATE ORDER ITEMS
                # + REDUCE STOCK
                # =================================================

                for checked_item in checked_items:

                    product = checked_item["product"]

                    quantity = checked_item["quantity"]

                    price = checked_item["price"]

                    item_total = checked_item["item_total"]


                    # ---------------------------------------------
                    # CREATE ORDER ITEM
                    # ---------------------------------------------

                    OrderItem.objects.create(

                        order=order,

                        product=product,

                        product_name=
                            product.name,

                        quantity=
                            quantity,

                        price=
                            price,

                        item_total=
                            item_total
                    )


                    # ---------------------------------------------
                    # REDUCE PRODUCT STOCK
                    # ---------------------------------------------

                    product.stock -= quantity

                    product.save(
                        update_fields=["stock"]
                    )


                    # ---------------------------------------------
                    # IF STOCK BECOMES ZERO
                    # ---------------------------------------------

                    if product.stock == 0:

                        product.available = False

                        product.save(
                            update_fields=["available"]
                        )


            # =================================================
            # SUCCESS RESPONSE
            # =================================================

            return JsonResponse(
                {
                    "success": True,
                    "order_id": order.id,
                    "message":
                        "Order placed successfully."
                }
            )


        except Exception as e:

            return JsonResponse(
                {
                    "success": False,
                    "message": str(e)
                },
                status=400
            )

def order_success(request):
    return render(
        request,
        'products/order_success.html'
    )
def before_you_order(request):
    return render(
        request,
        "products/before_you_order.html"
    )