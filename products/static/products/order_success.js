/* =========================================================
   KORDIVA — ORDER SUCCESS PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const orderIdElement =
        document.getElementById("orderId");

    const customerNameElement =
        document.getElementById("customerName");

    const paymentMethodElement =
        document.getElementById("paymentMethod");

    const grandTotalElement =
        document.getElementById("grandTotal");

    const orderedItemsElement =
        document.getElementById("orderedItems");

    const deliveryAddressElement =
        document.getElementById("deliveryAddress");


    /* =====================================================
       GET LAST ORDER ID
    ===================================================== */

    const orderId =
        localStorage.getItem(
            "kordivaLastOrderId"
        );


    /* =====================================================
       SHOW ORDER ID
    ===================================================== */

    if (orderId) {

        orderIdElement.textContent =
            "#" + orderId;

    }


    /* =====================================================
       GET PENDING ORDER DATA
       -----------------------------------------------------
       This will be used once checkout.js stores the
       customer/order information.
    ===================================================== */

    let orderData = null;


    try {

        const savedOrder =
            localStorage.getItem(
                "kordivaPendingOrder"
            );


        if (savedOrder) {

            orderData =
                JSON.parse(savedOrder);

        }

    } catch (error) {

        console.error(
            "Unable to read order data:",
            error
        );

    }


    /* =====================================================
       IF ORDER DATA EXISTS
    ===================================================== */

    if (orderData) {


        /* =================================================
           CUSTOMER
        ================================================= */

        if (
            orderData.customer &&
            orderData.customer.fullName
        ) {

            customerNameElement.textContent =
                orderData.customer.fullName;

        }


        /* =================================================
           PAYMENT METHOD
        ================================================= */

        if (orderData.paymentMethod) {

            if (
                orderData.paymentMethod === "cod"
            ) {

                paymentMethodElement.textContent =
                    "Cash on Delivery";

            } else {

                paymentMethodElement.textContent =
                    "Online Payment";

            }

        }


        /* =================================================
           TOTAL
        ================================================= */

        let subtotal =
            Number(orderData.subtotal) || 0;

        let delivery =
            Number(orderData.delivery) || 0;

        let grandTotal =
            subtotal + delivery;


        grandTotalElement.textContent =
            "₹" + grandTotal.toFixed(2);


        /* =================================================
           ORDER ITEMS
        ================================================= */

        if (
            Array.isArray(orderData.items)
        ) {

            orderedItemsElement.innerHTML = "";


            orderData.items.forEach(
                function (item) {


                    const quantity =
                        Number(item.quantity) || 1;


                    const price =
                        Number(item.price) || 0;


                    const itemTotal =
                        price * quantity;


                    const itemElement =
                        document.createElement("div");


                    itemElement.className =
                        "success-order-item";


                    itemElement.innerHTML = `

                        <img
                            src="${item.image || ""}"
                            alt="${item.name || "Product"}"
                            class="success-order-item-image"
                        >


                        <div class="success-order-item-info">

                            <div class="success-order-item-name">
                                ${item.name || "Product"}
                            </div>

                            <div class="success-order-item-quantity">
                                Quantity: ${quantity}
                            </div>

                        </div>


                        <div class="success-order-item-price">
                            ₹${itemTotal.toFixed(2)}
                        </div>

                    `;


                    orderedItemsElement.appendChild(
                        itemElement
                    );

                }
            );

        }


        /* =================================================
           DELIVERY ADDRESS
        ================================================= */

        if (
            orderData.address
        ) {

            const address =
                orderData.address;


            deliveryAddressElement.textContent =

                `${address.fullAddress || ""}
${address.city || ""}
${address.state || ""} - ${address.pin || ""}`;

        }

    }


});