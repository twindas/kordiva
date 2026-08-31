/* =========================================================
   KORDIVA — MAIN JAVASCRIPT
   HERO + SHOP BY CATEGORY + SPECIALITY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. KORDIVA — HERO SLIDER
    ===================================================== */

    const slides =
        document.querySelectorAll(".kordiva-slide");

    const dots =
        document.querySelectorAll(".hero-dot");

    const nextButton =
        document.querySelector(".hero-next");

    const prevButton =
        document.querySelector(".hero-prev");

    const heroSection =
        document.querySelector(".kordiva-hero");


    if (slides.length > 0) {

        console.log("KORDIVA HERO SLIDER LOADED");
        console.log("TOTAL SLIDES:", slides.length);


        let currentSlide = 0;
        let slideTimer = null;


        /* =================================================
           INITIAL STATE
        ================================================= */

        slides.forEach(function (slide, index) {

            slide.classList.remove("active");

            if (index === 0) {
                slide.classList.add("active");
            }

        });


        dots.forEach(function (dot, index) {

            dot.classList.remove("active");

            if (index === 0) {
                dot.classList.add("active");
            }

        });


        /* =================================================
           SHOW SLIDE
        ================================================= */

        function showSlide(index) {

            if (index < 0) {
                index = slides.length - 1;
            }

            if (index >= slides.length) {
                index = 0;
            }


            slides[currentSlide]
                .classList
                .remove("active");


            if (dots[currentSlide]) {

                dots[currentSlide]
                    .classList
                    .remove("active");

            }


            currentSlide = index;


            slides[currentSlide]
                .classList
                .add("active");


            if (dots[currentSlide]) {

                dots[currentSlide]
                    .classList
                    .add("active");

            }


            console.log(
                "KORDIVA CURRENT SLIDE:",
                currentSlide + 1
            );

        }


        /* =================================================
           NEXT SLIDE
        ================================================= */

        function nextSlide() {

            showSlide(
                currentSlide + 1
            );

        }


        /* =================================================
           PREVIOUS SLIDE
        ================================================= */

        function previousSlide() {

            showSlide(
                currentSlide - 1
            );

        }


        /* =================================================
           START AUTOMATIC SLIDER
        ================================================= */

        function startSlider() {

            clearInterval(slideTimer);

            slideTimer =
                setInterval(
                    function () {

                        nextSlide();

                    },
                    4500
                );

        }


        /* =================================================
           STOP SLIDER
        ================================================= */

        function stopSlider() {

            clearInterval(slideTimer);

        }


        /* =================================================
           START
        ================================================= */

        startSlider();


        /* =================================================
           NEXT BUTTON
        ================================================= */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    nextSlide();
                    startSlider();

                }
            );

        }


        /* =================================================
           PREVIOUS BUTTON
        ================================================= */

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                function () {

                    previousSlide();
                    startSlider();

                }
            );

        }


        /* =================================================
           DOT CLICK
        ================================================= */

        dots.forEach(
            function (dot, index) {

                dot.addEventListener(
                    "click",
                    function () {

                        showSlide(index);
                        startSlider();

                    }
                );

            }
        );


        /* =================================================
           KEYBOARD CONTROL
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "ArrowRight") {

                    nextSlide();
                    startSlider();

                }


                if (event.key === "ArrowLeft") {

                    previousSlide();
                    startSlider();

                }

            }
        );


        /* =================================================
           PAUSE ON HERO HOVER
        ================================================= */

        if (heroSection) {

            heroSection.addEventListener(
                "mouseenter",
                function () {

                    stopSlider();

                }
            );


            heroSection.addEventListener(
                "mouseleave",
                function () {

                    startSlider();

                }
            );

        }


        /* =================================================
           TOUCH / SWIPE
        ================================================= */

        let touchStartX = 0;
        let touchEndX = 0;


        if (heroSection) {

            heroSection.addEventListener(
                "touchstart",
                function (event) {

                    touchStartX =
                        event.changedTouches[0].screenX;

                },
                { passive: true }
            );


            heroSection.addEventListener(
                "touchend",
                function (event) {

                    touchEndX =
                        event.changedTouches[0].screenX;


                    const difference =
                        touchStartX - touchEndX;


                    /* Swipe left */

                    if (difference > 50) {

                        nextSlide();
                        startSlider();

                    }


                    /* Swipe right */

                    if (difference < -50) {

                        previousSlide();
                        startSlider();

                    }

                },
                { passive: true }
            );

        }

    }



    /* =====================================================
       2. KORDIVA — SHOP BY CATEGORY
    ===================================================== */

    const categorySection =
        document.querySelector(".category-section");

    const categoryItems =
        document.querySelectorAll(".category-item");


    if (
        categorySection &&
        categoryItems.length > 0
    ) {

        console.log(
            "KORDIVA SHOP BY CATEGORY LOADED"
        );


        /* =================================================
           INITIAL STATE
           CSS handles opacity: 0
        ================================================= */

        categoryItems.forEach(function (item) {

            item.classList.remove("scroll-show");

        });


        /* =================================================
           CATEGORY SCROLL REVEAL
        ================================================= */

        const categoryObserver =
            new IntersectionObserver(

                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            /* --------------------------------
                               SHOW CATEGORY ITEMS ONE BY ONE
                            -------------------------------- */

                            categoryItems.forEach(
                                function (item, index) {

                                    setTimeout(
                                        function () {

                                            item.classList.add(
                                                "scroll-show"
                                            );

                                        },
                                        index * 120
                                    );

                                }
                            );


                            /* --------------------------------
                               RUN ONLY ONCE
                            -------------------------------- */

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },

                {
                    threshold: 0.15
                }

            );


        categoryObserver.observe(
            categorySection
        );

    }



    /* =====================================================
       3. KORDIVA — SPECIALITY
    ===================================================== */

    const specialitySection =
        document.querySelector(
            ".kordiva-speciality"
        );

    const specialityCards =
        document.querySelectorAll(
            ".speciality-card"
        );

    const specialityFooter =
        document.querySelector(
            ".speciality-footer"
        );


    if (
        specialitySection &&
        specialityCards.length > 0
    ) {

        console.log(
            "KORDIVA SPECIALITY LOADED"
        );


        /* =================================================
           SCROLL REVEAL
        ================================================= */

        const specialityObserver =
            new IntersectionObserver(

                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            /* --------------------------------
                               CARDS APPEAR ONE BY ONE
                            -------------------------------- */

                            specialityCards.forEach(
                                function (
                                    card,
                                    index
                                ) {

                                    setTimeout(
                                        function () {

                                            card.classList.add(
                                                "show"
                                            );

                                        },
                                        index * 100
                                    );

                                }
                            );


                            /* --------------------------------
                               START GLOW EFFECT
                            -------------------------------- */

                            setTimeout(
                                function () {

                                    specialityCards.forEach(
                                        function (
                                            card,
                                            index
                                        ) {

                                            setTimeout(
                                                function () {

                                                    card.classList.add(
                                                        "glow-active"
                                                    );

                                                },
                                                index * 160
                                            );

                                        }
                                    );

                                },
                                900
                            );


                            /* --------------------------------
                               FOOTER ANIMATION
                            -------------------------------- */

                            if (
                                specialityFooter
                            ) {

                                setTimeout(
                                    function () {

                                        specialityFooter.classList.add(
                                            "show"
                                        );

                                    },
                                    1500
                                );

                            }


                            /* --------------------------------
                               RUN ONLY ONCE
                            -------------------------------- */

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },

                {
                    threshold: 0.18
                }

            );


        specialityObserver.observe(
            specialitySection
        );

    }


});