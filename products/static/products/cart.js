/* =========================================================
   KORDIVA — CART PAGE (LOCAL STORAGE VERSION)
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cartContainer = document.getElementById("cartItemsContainer");
    const emptyCart = document.getElementById("emptyCart");
    const cartSummary = document.getElementById("cartSummary");

    const subtotalElement = document.getElementById("cartSubtotal");
    const deliveryElement = document.getElementById("deliveryCharge");
    const grandTotalElement = document.getElementById("grandTotal");

    const navbarCartCount = document.querySelector(".cart-count");


    /* =====================================================
       GET CART FROM LOCAL STORAGE
    ===================================================== */

    function getCart() {

        return JSON.parse(
            localStorage.getItem("kordivaCart")
        ) || [];

    }


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart(cart) {

        localStorage.setItem(
            "kordivaCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       UPDATE NAVBAR CART COUNT
    ===================================================== */

    function updateNavbarCount() {

        if (!navbarCartCount) return;

        const cart = getCart();

        let total = 0;

        cart.forEach(function (item) {

            total += Number(item.quantity) || 0;

        });

        navbarCartCount.textContent = total;

    }


    /* =====================================================
       DISPLAY CART PRODUCTS
    ===================================================== */

    function displayCart() {

        const cart = getCart();

        if (cartContainer) {

            cartContainer.innerHTML = "";

        }

        let subtotal = 0;


        /* EMPTY CART */

        if (cart.length === 0) {

            if (emptyCart) {

                emptyCart.style.display = "block";

            }

            if (cartSummary) {

                cartSummary.style.display = "none";

            }

            updateNavbarCount();

            return;

        }


        if (emptyCart) {

            emptyCart.style.display = "none";

        }

        if (cartSummary) {

            cartSummary.style.display = "block";

        }


        cart.forEach(function (item) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;

            const stock =
                Number(item.stock);


            const total =
                price * quantity;

            subtotal += total;


            const cartItem =
                document.createElement("div");

            cartItem.className =
                "cart-item";

            cartItem.dataset.id =
                item.id;


            cartItem.innerHTML = `

                <div class="cart-product-image">

                    <img
                        src="${item.image || ""}"
                        alt="${item.name || "Product"}"
                    >

                </div>


                <div class="cart-product-info">

                    <h2>
                        ${item.name || "Product"}
                    </h2>


                    <p class="cart-product-price">

                        ₹${price.toFixed(2)}

                    </p>


                    ${
                        Number.isFinite(stock)
                        ?
                        `
                        <p class="cart-stock-info">

                            Stock available:
                            <strong>${stock}</strong>

                        </p>
                        `
                        :
                        ""
                    }


                    <div class="quantity-wrapper">


                        <button
                            class="quantity-btn decrease-btn"
                            data-id="${item.id}"
                        >
                            −
                        </button>


                        <span class="quantity-value">

                            ${quantity}

                        </span>


                        <button
                            class="quantity-btn increase-btn"
                            data-id="${item.id}"
                        >
                            +
                        </button>


                    </div>

                </div>


                <div class="cart-item-right">

                    <p class="item-total">

                        ₹${total.toFixed(2)}

                    </p>


                    <button
                        class="remove-btn"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            `;


            if (cartContainer) {

                cartContainer.appendChild(
                    cartItem
                );

            }

        });


        updateSummary(subtotal);

        addEvents();

        updateNavbarCount();

    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateSummary(subtotal) {

        let delivery =
            subtotal > 0 ? 50 : 0;

        let grandTotal =
            subtotal + delivery;


        if (subtotalElement) {

            subtotalElement.textContent =
                "₹" + subtotal.toFixed(2);

        }


        if (deliveryElement) {

            deliveryElement.textContent =
                "₹" + delivery.toFixed(2);

        }


        if (grandTotalElement) {

            grandTotalElement.textContent =
                "₹" + grandTotal.toFixed(2);

        }

    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    function addEvents() {


        /* =================================================
           INCREASE
        ================================================= */

        document
            .querySelectorAll(".increase-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;

                        let cart =
                            getCart();


                        const product =
                            cart.find(
                                item => item.id === id
                            );


                        if (!product) return;


                        const currentQuantity =
                            Number(product.quantity) || 1;


                        const stock =
                            Number(product.stock);


                        /* =================================
                           STOCK CHECK
                        ================================= */

                        if (
                            Number.isFinite(stock) &&
                            currentQuantity >= stock
                        ) {

                            alert(
                                `Only ${stock} item(s) are available in stock.\n\nOur stock is ${stock}.`
                            );

                            return;

                        }


                        /* =================================
                           INCREASE QUANTITY
                        ================================= */

                        product.quantity =
                            currentQuantity + 1;


                        saveCart(cart);

                        displayCart();

                    }
                );

            });


        /* =================================================
           DECREASE
        ================================================= */

        document
            .querySelectorAll(".decrease-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;

                        let cart =
                            getCart();


                        const product =
                            cart.find(
                                item => item.id === id
                            );


                        if (
                            product &&
                            Number(product.quantity) > 1
                        ) {

                            product.quantity =
                                Number(product.quantity) - 1;

                        }


                        saveCart(cart);

                        displayCart();

                    }
                );

            });


        /* =================================================
           REMOVE
        ================================================= */

        document
            .querySelectorAll(".remove-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;

                        let cart =
                            getCart();


                        cart =
                            cart.filter(
                                item => item.id !== id
                            );


                        saveCart(cart);

                        displayCart();

                    }
                );

            });

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    displayCart();

});