/* =========================================================
   KORDIVA — PRODUCT DETAIL
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const addCartButton =
    document.querySelector('.add-cart-btn');

const cartCount =
    document.querySelector('.cart-count');



/* =========================================================
   GET CART
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem('kordivaCart')
        ) || [];

    } catch (error) {

        return [];

    }

}



/* =========================================================
   SAVE CART
========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        'kordivaCart',
        JSON.stringify(cart)
    );

}



/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cart = getCart();

    let totalQuantity = 0;

    cart.forEach(function(item) {

        totalQuantity +=
            Number(item.quantity) || 0;

    });


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }

}


updateCartCount();



/* =========================================================
   GET PRODUCT INFORMATION
========================================================= */

function getProductInformation() {


    /* =====================================================
       PRODUCT NAME
    ===================================================== */

    const productName =
        document.querySelector(
            '.product-title'
        )?.textContent.trim();



    /* =====================================================
       PRODUCT SLUG
    ===================================================== */

    const productSlug =
        document.querySelector(
            '.product-slug'
        )?.textContent
         .replace('Product ID:', '')
         .trim();



    /* =====================================================
       PRODUCT PRICE
    ===================================================== */

    const priceText =
        document.querySelector(
            '.product-price span'
        )?.textContent
         .replace('₹', '')
         .replace(/,/g, '')
         .trim();


    const price =
        parseFloat(priceText) || 0;



    /* =====================================================
       PRODUCT IMAGE
    ===================================================== */

    const image =
        document.getElementById(
            'mainProductImage'
        )?.src;



    /* =====================================================
       SELECTED QUANTITY
    ===================================================== */

    const quantity =
        parseInt(
            document.getElementById(
                'productQuantity'
            )?.value
        ) || 1;



    /* =====================================================
       PRODUCT STOCK
    ===================================================== */

    let stock = null;


    const stockNumberElement =
        document.querySelector(
            '.stock-number'
        );


    if (stockNumberElement) {

        const stockText =
            stockNumberElement.textContent;


        const stockMatch =
            stockText.match(/\d+/);


        if (stockMatch) {

            stock =
                parseInt(
                    stockMatch[0]
                );

        }

    }



    /* =====================================================
       STOCK FALLBACK
    ===================================================== */

    if (!Number.isFinite(stock)) {

        const stockTextElement =
            document.querySelector(
                '.product-stock'
            );


        if (stockTextElement) {

            const stockText =
                stockTextElement.textContent;


            const stockMatch =
                stockText.match(/\d+/);


            if (stockMatch) {

                stock =
                    parseInt(
                        stockMatch[0]
                    );

            }

        }

    }



    /* =====================================================
       RETURN PRODUCT
    ===================================================== */

    return {

        name:
            productName,

        id:
            productSlug,

        price:
            price,

        image:
            image,

        quantity:
            quantity,

        stock:
            stock

    };

}



/* =========================================================
   STOCK VALIDATION
========================================================= */

function validateStock(product, requestedQuantity) {


    const stock =
        product.stock;



    /* =====================================================
       STOCK INFORMATION NOT FOUND
    ===================================================== */

    if (!Number.isFinite(stock)) {

        alert(
            'Stock information is not available. Please refresh the page and try again.'
        );

        return false;

    }



    /* =====================================================
       OUT OF STOCK
    ===================================================== */

    if (stock <= 0) {

        alert(
            'Sorry, this product is currently out of stock.'
        );

        return false;

    }



    /* =====================================================
       REQUESTED QUANTITY GREATER THAN STOCK
    ===================================================== */

    if (requestedQuantity > stock) {

        alert(
            `Only ${stock} item(s) are available in stock.\n\nOur stock is ${stock}.`
        );

        return false;

    }



    return true;

}



/* =========================================================
   ADD TO CART
========================================================= */

if (addCartButton) {

    addCartButton.addEventListener(
        'click',
        function() {


            /* =================================================
               GET PRODUCT
            ================================================= */

            const product =
                getProductInformation();


            const productName =
                product.name;


            const productSlug =
                product.id;


            const quantity =
                product.quantity;


            const stock =
                product.stock;



            /* =================================================
               PRODUCT INFORMATION CHECK
            ================================================= */

            if (!productSlug) {

                alert(
                    'Product information not found.'
                );

                return;

            }



            /* =================================================
               CHECK SELECTED QUANTITY
            ================================================= */

            if (
                !validateStock(
                    product,
                    quantity
                )
            ) {

                return;

            }



            /* =================================================
               GET CART
            ================================================= */

            let cart =
                getCart();



            /* =================================================
               FIND EXISTING PRODUCT
            ================================================= */

            const existingProduct =
                cart.find(function(item) {

                    return (
                        item.id ===
                        productSlug
                    );

                });



            /* =================================================
               PRODUCT ALREADY IN CART
            ================================================= */

            if (existingProduct) {


                const currentQuantity =
                    Number(
                        existingProduct.quantity
                    ) || 0;


                const newQuantity =
                    currentQuantity +
                    quantity;



                /* =============================================
                   CHECK TOTAL CART QUANTITY
                ============================================= */

                if (
                    newQuantity >
                    stock
                ) {

                    alert(
                        `Only ${stock} item(s) are available in stock.\n\nYou already have ${currentQuantity} item(s) in your cart.\n\nOur stock is ${stock}.`
                    );

                    return;

                }



                /* =============================================
                   UPDATE QUANTITY
                ============================================= */

                existingProduct.quantity =
                    newQuantity;



                /* =============================================
                   UPDATE STOCK
                ============================================= */

                existingProduct.stock =
                    stock;



                /* =============================================
                   UPDATE PRICE / IMAGE / NAME
                ============================================= */

                existingProduct.name =
                    product.name;

                existingProduct.price =
                    product.price;

                existingProduct.image =
                    product.image;


            } else {


                /* =================================================
                   NEW PRODUCT
                ================================================= */

                cart.push({

                    id:
                        productSlug,

                    name:
                        productName,

                    price:
                        product.price,

                    image:
                        product.image,

                    quantity:
                        quantity,

                    stock:
                        stock

                });

            }



            /* =================================================
               SAVE CART
            ================================================= */

            saveCart(cart);



            /* =================================================
               UPDATE NAVBAR COUNT
            ================================================= */

            updateCartCount();



            /* =================================================
               SUCCESS MESSAGE
            ================================================= */

            alert(
                productName +
                ' added to your cart!'
            );

        }
    );

}

/* =========================================================
   BUY NOW
========================================================= */

const buyNowButton =
    document.querySelector('.buy-now-btn');


if (buyNowButton) {

    buyNowButton.addEventListener(
        'click',
        function() {

            const product =
                getProductInformation();


            const productName =
                product.name;


            const productSlug =
                product.id;


            const quantity =
                product.quantity;


            const stock =
                product.stock;


            /* =============================================
               PRODUCT CHECK
            ============================================= */

            if (!productSlug) {

                alert(
                    'Product information not found.'
                );

                return;

            }


            /* =============================================
               STOCK = 0
            ============================================= */

            if (
                Number.isFinite(stock) &&
                stock <= 0
            ) {

                alert(
                    'Sorry, this product is currently out of stock.'
                );

                return;

            }


            /* =============================================
               QUANTITY > STOCK
            ============================================= */

            if (
                Number.isFinite(stock) &&
                quantity > stock
            ) {

                alert(
                    `Only ${stock} item(s) are available in stock.\n\nOur stock is ${stock}.`
                );

                return;

            }


            /* =============================================
               GET CART
            ============================================= */

            let cart =
                getCart();


            /* =============================================
               CHECK IF PRODUCT ALREADY EXISTS
            ============================================= */

            const existingProduct =
                cart.find(function(item) {

                    return item.id === productSlug;

                });


            /* =============================================
               PRODUCT ALREADY IN CART
            ============================================= */

            if (existingProduct) {

                const currentQuantity =
                    Number(
                        existingProduct.quantity
                    ) || 0;


                const newQuantity =
                    currentQuantity +
                    quantity;


                /* CHECK STOCK */

                if (
                    Number.isFinite(stock) &&
                    newQuantity > stock
                ) {

                    alert(
                        `Only ${stock} item(s) are available in stock.\n\nYou already have ${currentQuantity} item(s) in your cart.\n\nOur stock is ${stock}.`
                    );

                    return;

                }


                existingProduct.quantity =
                    newQuantity;


                existingProduct.stock =
                    stock;

            }


            /* =============================================
               NEW PRODUCT
            ============================================= */

            else {

                cart.push({

                    id:
                        productSlug,

                    name:
                        productName,

                    price:
                        product.price,

                    image:
                        product.image,

                    quantity:
                        quantity,

                    stock:
                        stock

                });

            }


            /* =============================================
               SAVE TO CART
            ============================================= */

            saveCart(cart);


            /* =============================================
               UPDATE CART COUNT
            ============================================= */

            updateCartCount();


            /* =============================================
               GO DIRECTLY TO CART PAGE
            ============================================= */

            window.location.href = '/cart/';

        }
    );

}
/* =========================================================
   RATING
========================================================= */

const ratingContainer =
    document.querySelector(
        '.rating-stars'
    );


let selectedRating = 0;



if (ratingContainer) {

    ratingContainer.innerHTML = '';


    for (
        let i = 1;
        i <= 5;
        i++
    ) {


        const star =
            document.createElement(
                'button'
            );


        star.type =
            'button';


        star.className =
            'rating-star';


        star.dataset.rating =
            i;


        star.textContent =
            '☆';



        star.addEventListener(
            'click',
            function() {


                selectedRating =
                    i;



                const allStars =
                    ratingContainer.querySelectorAll(
                        '.rating-star'
                    );



                allStars.forEach(
                    function(item) {


                        const rating =
                            parseInt(
                                item.dataset.rating
                            );



                        if (
                            rating <=
                            selectedRating
                        ) {

                            item.textContent =
                                '★';


                            item.classList.add(
                                'selected'
                            );


                        } else {

                            item.textContent =
                                '☆';


                            item.classList.remove(
                                'selected'
                            );

                        }

                    }
                );

            }
        );



        ratingContainer.appendChild(
            star
        );

    }

}



/* =========================================================
   REVIEW FORM
========================================================= */

const ratingSection =
    document.querySelector(
        '.rating-section'
    );



if (ratingSection) {


    const reviewForm =
        document.createElement(
            'form'
        );


    reviewForm.className =
        'review-form';



    reviewForm.innerHTML = `

        <textarea
            class="review-input"
            placeholder="Write your review..."
            rows="4"
        ></textarea>

        <button
            type="submit"
            class="review-submit-btn"
        >
            SUBMIT REVIEW
        </button>

        <div class="reviews-list"></div>

    `;



    ratingSection.appendChild(
        reviewForm
    );



    /* =====================================================
       SUBMIT REVIEW
    ===================================================== */

    reviewForm.addEventListener(
        'submit',
        function(event) {


            event.preventDefault();



            /* =================================================
               RATING CHECK
            ================================================= */

            if (
                selectedRating === 0
            ) {

                alert(
                    'Please select a rating first.'
                );

                return;

            }



            /* =================================================
               REVIEW INPUT
            ================================================= */

            const reviewInput =
                reviewForm.querySelector(
                    '.review-input'
                );


            const reviewText =
                reviewInput.value.trim();



            if (!reviewText) {

                alert(
                    'Please write a review.'
                );

                return;

            }



            /* =================================================
               PRODUCT ID
            ================================================= */

            const productSlug =
                document.querySelector(
                    '.product-slug'
                )?.textContent
                 .replace(
                     'Product ID:',
                     ''
                 )
                 .trim();



            /* =================================================
               GET REVIEWS
            ================================================= */

            let reviews =
                JSON.parse(
                    localStorage.getItem(
                        'kordivaReviews'
                    )
                ) || [];



            /* =================================================
               ADD REVIEW
            ================================================= */

            reviews.push({

                productId:
                    productSlug,

                rating:
                    selectedRating,

                review:
                    reviewText,

                date:
                    new Date().toISOString()

            });



            /* =================================================
               SAVE REVIEWS
            ================================================= */

            localStorage.setItem(

                'kordivaReviews',

                JSON.stringify(
                    reviews
                )

            );



            /* =================================================
               CLEAR INPUT
            ================================================= */

            reviewInput.value = '';



            /* =================================================
               SUCCESS MESSAGE
            ================================================= */

            alert(
                'Thank you! Your review has been submitted.'
            );



            loadReviews();

        }
    );



    /* =====================================================
       LOAD REVIEWS
    ===================================================== */

    function loadReviews() {


        const reviewList =
            reviewForm.querySelector(
                '.reviews-list'
            );



        const productSlug =
            document.querySelector(
                '.product-slug'
            )?.textContent
             .replace(
                 'Product ID:',
                 ''
             )
             .trim();



        const reviews =
            JSON.parse(
                localStorage.getItem(
                    'kordivaReviews'
                )
            ) || [];



        const productReviews =
            reviews.filter(
                function(review) {

                    return (
                        review.productId ===
                        productSlug
                    );

                }
            );



        reviewList.innerHTML =
            '';



        /* =================================================
           NO REVIEWS
        ================================================= */

        if (
            productReviews.length ===
            0
        ) {

            reviewList.innerHTML =
                '<p>No reviews yet.</p>';

            return;

        }



        /* =================================================
           DISPLAY REVIEWS
        ================================================= */

        productReviews.forEach(
            function(review) {


                const reviewItem =
                    document.createElement(
                        'div'
                    );


                reviewItem.className =
                    'review-item';



                let stars =
                    '';



                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {

                    stars +=
                        i <= review.rating
                            ? '★'
                            : '☆';

                }



                reviewItem.innerHTML = `

                    <div class="review-stars">
                        ${stars}
                    </div>

                    <p>
                        ${review.review}
                    </p>

                `;



                reviewList.appendChild(
                    reviewItem
                );

            }
        );

    }



    /* =====================================================
       LOAD REVIEWS ON PAGE LOAD
    ===================================================== */

    loadReviews();

}