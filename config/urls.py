"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from products.views import (
    home,
    category_products,
    product_type_products,
    product_detail,
    contact,
    about,
    privacy_policy,
    terms_conditions,
    shipping_policy,
    returns_policy,
    customer_signup,
    CustomerLoginView,
    customer_logout,
    customer_account,
    cart,
    checkout,
    order_success,
    my_orders,
    saved_address,
    order_tracking,
    before_you_order,
)

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    path('', home, name='home'),

    path(
        'category/<slug:slug>/',
        category_products,
        name='category_products'
    ),

    path(
        'type/<slug:slug>/',
        product_type_products,
        name='product_type_products'
    ),

    path(
    'product/<slug:slug>/',
    product_detail,
    name='product_detail'
    ),

    path(
        'contact/',
        contact,
        name='contact'
    ),

    path(
        "cart/",
        cart,
        name="cart"
    ),
    path(
    'privacy-policy/',
    privacy_policy,
    name='privacy_policy'
),

path(
    'terms-conditions/',
    terms_conditions,
    name='terms_conditions'
),

path(
    'shipping-policy/',
    shipping_policy,
    name='shipping_policy'
),

path(
    'returns-policy/',
    returns_policy,
    name='returns_policy'
),
path(
    'about/',
    about,
    name='about'
),
path(
    "account/",
    customer_account,
    name="account"
),
path(
    "saved-address/",
    saved_address,
    name="saved_address"
),
path(
    "signup/",
    customer_signup,
    name="signup"
),

path(
    "login/",
    CustomerLoginView.as_view(),
    name="login"
),

path(
    "logout/",
    customer_logout,
    name="logout"
),
path(
    "checkout/",
    checkout,
    name="checkout"
),
path(
    'order-success/',
    order_success,
    name='order_success'
),
path(
    'my-orders/',
    my_orders,
    name='my_orders'
),
path(
    "order-tracking/",
    order_tracking,
    name="order_tracking"
),
path(
    "before-you-order/",
    before_you_order,
    name="before_you_order"
),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)