/* =========================================================
   KORDIVA — CHECKOUT PAGE
   DJANGO ORDER SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutDelivery =
        document.getElementById("checkoutDelivery");

    const checkoutGrandTotal =
        document.getElementById("checkoutGrandTotal");

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");


    /* =====================================================
       GET CART
    ===================================================== */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem("kordivaCart")
            ) || [];

        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(amount) {

        return "₹" + Number(amount).toFixed(2);

    }


    /* =====================================================
       DISPLAY CHECKOUT ITEMS
    ===================================================== */

    function displayCheckoutItems() {

        const cart = getCart();

        checkoutItems.innerHTML = "";

        let subtotal = 0;


        if (cart.length === 0) {

            checkoutItems.innerHTML = `
                <div class="checkout-empty">
                    Your cart is empty.
                </div>
            `;

            checkoutSubtotal.textContent = "₹0.00";
            checkoutDelivery.textContent = "₹0.00";
            checkoutGrandTotal.textContent = "₹0.00";

            placeOrderBtn.disabled = true;

            return;
        }


        placeOrderBtn.disabled = false;


        cart.forEach(function (item) {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            const itemTotal =
                price * quantity;


            subtotal += itemTotal;


            const itemElement =
                document.createElement("div");

            itemElement.className =
                "checkout-item";


            itemElement.innerHTML = `

                <img
                    src="${item.image || ""}"
                    alt="${item.name || "Product"}"
                    class="checkout-item-image"
                >

                <div class="checkout-item-info">

                    <div class="checkout-item-name">
                        ${item.name || "Product"}
                    </div>

                    <div class="checkout-item-quantity">
                        Quantity: ${quantity}
                    </div>

                </div>

                <div class="checkout-item-price">
                    ${formatPrice(itemTotal)}
                </div>

            `;


            checkoutItems.appendChild(
                itemElement
            );

        });


        const deliveryCharge =
            subtotal > 0 ? 50 : 0;


        const grandTotal =
            subtotal + deliveryCharge;


        checkoutSubtotal.textContent =
            formatPrice(subtotal);

        checkoutDelivery.textContent =
            formatPrice(deliveryCharge);

        checkoutGrandTotal.textContent =
            formatPrice(grandTotal);

    }


    /* =====================================================
       CSRF TOKEN
    ===================================================== */

    function getCSRFToken() {

        const cookieValue =
            document.cookie
                .split("; ")
                .find(row =>
                    row.startsWith("csrftoken=")
                );

        if (!cookieValue) {
            return "";
        }

        return decodeURIComponent(
            cookieValue.split("=")[1]
        );

    }


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    placeOrderBtn.addEventListener(
        "click",
        async function () {


            const cart = getCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            /* =============================================
               CUSTOMER INFORMATION
            ============================================= */

            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById("mobile")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            /* =============================================
               DELIVERY ADDRESS
            ============================================= */

            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const state =
                document
                    .getElementById("state")
                    .value
                    .trim();


            const pin =
                document
                    .getElementById("pin")
                    .value
                    .trim();


            /* =============================================
               VALIDATION
            ============================================= */

            if (
                !fullName ||
                !mobile ||
                !email ||
                !address ||
                !city ||
                !state ||
                !pin
            ) {

                alert(
                    "Please fill in all required details."
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(mobile)
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            if (
                !/^[0-9]{6}$/.test(pin)
            ) {

                alert(
                    "Please enter a valid 6-digit PIN code."
                );

                return;

            }


            /* =============================================
               PAYMENT METHOD
            ============================================= */

            const payment =
                document.querySelector(
                    'input[name="payment_method"]:checked'
                );


            const paymentMethod =
                payment
                    ? payment.value
                    : "cod";


            /* =============================================
               CALCULATE TOTAL
            ============================================= */

            let subtotal = 0;


            cart.forEach(function (item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                subtotal +=
                    price * quantity;

            });


            const delivery =
                subtotal > 0 ? 50 : 0;


            /* =============================================
               ORDER DATA
            ============================================= */

            const orderData = {

                customer: {

                    fullName:
                        fullName,

                    mobile:
                        mobile,

                    email:
                        email

                },


                address: {

                    fullAddress:
                        address,

                    city:
                        city,

                    state:
                        state,

                    pin:
                        pin

                },


                paymentMethod:
                    paymentMethod,


                items:
                    cart,


                subtotal:
                    subtotal,

                delivery:
                    delivery

            };


            /* =============================================
               BUTTON STATE
            ============================================= */

            placeOrderBtn.disabled = true;

            placeOrderBtn.textContent =
                "PLACING ORDER...";


            try {


                /* =========================================
                   SEND DATA TO DJANGO
                ========================================== */

                const response =
                    await fetch(
                        "/checkout/",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "X-CSRFToken":
                                    getCSRFToken()

                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )

                        }
                    );


                const result =
                    await response.json();


                /* =========================================
                   SUCCESS
                ========================================== */

                if (result.success) {

                    alert(
                        "Order placed successfully!"
                    );


                    /* =====================================================
   SAVE ORDER INFORMATION FOR SUCCESS PAGE
===================================================== */

localStorage.setItem(
    "kordivaPendingOrder",
    JSON.stringify(orderData)
);


/* =====================================================
   SAVE ORDER ID
===================================================== */

localStorage.setItem(
    "kordivaLastOrderId",
    result.order_id
);


/* =====================================================
   CLEAR CART
===================================================== */

localStorage.removeItem(
    "kordivaCart"
);


/* =====================================================
   GO TO ORDER SUCCESS PAGE
===================================================== */

window.location.href =
    "/order-success/";

return;

                }


                /* =========================================
                   BACKEND ERROR
                ========================================== */

                alert(
                    result.message ||
                    "Unable to place order."
                );


                placeOrderBtn.disabled = false;

                placeOrderBtn.textContent =
                    "PLACE ORDER";


            } catch (error) {


                console.error(
                    "Order error:",
                    error
                );


                alert(
                    "Something went wrong. Please try again."
                );


                placeOrderBtn.disabled = false;

                placeOrderBtn.textContent =
                    "PLACE ORDER";

            }

        }
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    displayCheckoutItems();

});

