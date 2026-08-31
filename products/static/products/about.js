/* =========================================================
   KORDIVA — ABOUT PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   SCROLL REVEAL
   General sections + Timeline cards
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* -----------------------------------------
           GENERAL REVEAL SECTIONS
        ----------------------------------------- */

        const revealSections =
            document.querySelectorAll(
                ".reveal-section"
            );


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        revealSections.forEach(
            function (section) {

                observer.observe(section);

            }
        );


        /* -----------------------------------------
           TIMELINE SCROLL ANIMATION
        ----------------------------------------- */

        const timelineItems =
            document.querySelectorAll(
                ".timeline-item"
            );


        const timelineObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.18
                }
            );


        timelineItems.forEach(
            function (item) {

                timelineObserver.observe(item);

            }
        );

    }
);



/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        links.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            this.getAttribute(
                                "href"
                            );


                        /* Ignore empty # links */

                        if (
                            targetId === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (target) {

                            event.preventDefault();


                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }
                );

            }
        );

    }
);



/* =========================================================
   CART COUNT
   Uses the same localStorage cart
   used by your product_details.js
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const cartCount =
            document.querySelector(
                ".cart-count"
            );


        /* -----------------------------------------
           GET CART
        ----------------------------------------- */

        function getCart() {

            return JSON.parse(
                localStorage.getItem(
                    "kordivaCart"
                )
            ) || [];

        }


        /* -----------------------------------------
           UPDATE CART COUNT
        ----------------------------------------- */

        function updateCartCount() {

            if (!cartCount) {

                return;

            }


            const cart =
                getCart();


            let totalQuantity = 0;


            cart.forEach(
                function (item) {

                    totalQuantity +=
                        Number(
                            item.quantity
                        ) || 0;

                }
            );


            cartCount.textContent =
                totalQuantity;

        }


        /* Initial count */

        updateCartCount();


        /* -----------------------------------------
           UPDATE WHEN CART CHANGES
        ----------------------------------------- */

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key ===
                    "kordivaCart"
                ) {

                    updateCartCount();

                }

            }
        );

    }
);