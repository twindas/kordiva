/* =========================================================
   KORDIVA — BEFORE YOU ORDER
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           SCROLL REVEAL
        ================================================== */

        const cards =
            document.querySelectorAll(
                ".reveal-left, .reveal-right"
            );


        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.15
                }

            );


        cards.forEach(
            function (card) {

                observer.observe(card);

            }
        );


        /* =================================================
           STAGGER CARD ANIMATION
        ================================================== */

        cards.forEach(
            function (card, index) {

                card.style.transitionDelay =
                    `${index * 0.08}s`;

            }
        );


        /* =================================================
           MOUSE GLOW EFFECT
        ================================================== */

        const infoCards =
            document.querySelectorAll(
                ".info-card"
            );


        infoCards.forEach(
            function (card) {


                card.addEventListener(
                    "mousemove",
                    function (event) {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        card.style.setProperty(
                            "--mouse-x",
                            `${x}px`
                        );


                        card.style.setProperty(
                            "--mouse-y",
                            `${y}px`
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        card.style.removeProperty(
                            "--mouse-x"
                        );

                        card.style.removeProperty(
                            "--mouse-y"
                        );

                    }
                );

            }
        );


        /* =================================================
           PROMISE PARALLAX GLOW
        ================================================== */

        const promise =
            document.querySelector(
                ".promise-section"
            );


        const glow =
            document.querySelector(
                ".promise-glow"
            );


        if (promise && glow) {

            promise.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        promise.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const moveX =
                        (x / rect.width - 0.5) * 80;


                    const moveY =
                        (y / rect.height - 0.5) * 80;


                    glow.style.transform =
                        `translate(${moveX}px, ${moveY}px) scale(1.05)`;

                }
            );


            promise.addEventListener(
                "mouseleave",
                function () {

                    glow.style.transform =
                        "translate(0, 0) scale(1)";

                }
            );

        }


        /* =================================================
           REDUCE MOTION ACCESSIBILITY
        ================================================== */

        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        if (reduceMotion.matches) {

            document
                .querySelectorAll(
                    ".info-card"
                )
                .forEach(
                    function (card) {

                        card.style.animation =
                            "none";

                    }
                );

        }

    }
);