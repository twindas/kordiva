/* =========================================================
   KORDIVA — SAVED ADDRESS
========================================================= */


document.addEventListener(
    'DOMContentLoaded',
    function () {


        const form =
            document.getElementById(
                'savedAddressForm'
            );


        const saveButton =
            document.getElementById(
                'saveAddressBtn'
            );


        if (!form || !saveButton) {

            return;

        }



        /* =================================================
           FORM SUBMIT
        ================================================= */

        form.addEventListener(
            'submit',
            function (event) {


                const fullName =
                    document
                        .getElementById('full_name')
                        .value
                        .trim();


                const mobile =
                    document
                        .getElementById('mobile')
                        .value
                        .trim();


                const address =
                    document
                        .getElementById('address')
                        .value
                        .trim();


                const city =
                    document
                        .getElementById('city')
                        .value
                        .trim();


                const state =
                    document
                        .getElementById('state')
                        .value
                        .trim();


                const pin =
                    document
                        .getElementById('pin')
                        .value
                        .trim();



                /* =========================================
                   BASIC VALIDATION
                ========================================= */

                if (
                    !fullName ||
                    !mobile ||
                    !address ||
                    !city ||
                    !state ||
                    !pin
                ) {

                    event.preventDefault();

                    alert(
                        'Please fill in all address details.'
                    );

                    return;

                }



                /* =========================================
                   MOBILE VALIDATION
                ========================================= */

                const mobilePattern =
                    /^[0-9]{10,15}$/;


                if (
                    !mobilePattern.test(
                        mobile
                    )
                ) {

                    event.preventDefault();

                    alert(
                        'Please enter a valid mobile number.'
                    );

                    return;

                }



                /* =========================================
                   PIN VALIDATION
                ========================================= */

                const pinPattern =
                    /^[0-9]{4,10}$/;


                if (
                    !pinPattern.test(pin)
                ) {

                    event.preventDefault();

                    alert(
                        'Please enter a valid PIN code.'
                    );

                    return;

                }



                /* =========================================
                   BUTTON LOADING STATE
                ========================================= */

                saveButton.disabled =
                    true;


                saveButton.style.opacity =
                    '0.7';


                saveButton.style.cursor =
                    'wait';


                const buttonText =
                    saveButton.querySelector(
                        'span:first-child'
                    );


                if (buttonText) {

                    buttonText.textContent =
                        'SAVING...';

                }

            }
        );



        /* =================================================
           ONLY NUMBERS FOR MOBILE
        ================================================= */

        const mobileInput =
            document.getElementById(
                'mobile'
            );


        if (mobileInput) {

            mobileInput.addEventListener(
                'input',
                function () {

                    this.value =
                        this.value.replace(
                            /\D/g,
                            ''
                        );

                }
            );

        }



        /* =================================================
           ONLY NUMBERS FOR PIN
        ================================================= */

        const pinInput =
            document.getElementById(
                'pin'
            );


        if (pinInput) {

            pinInput.addEventListener(
                'input',
                function () {

                    this.value =
                        this.value.replace(
                            /\D/g,
                            ''
                        );

                }
            );

        }


    }
);