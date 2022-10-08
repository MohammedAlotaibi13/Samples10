// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
                spinnerButton()
            }, false)
        })
})()


function spinnerButton() {
    $(document).ready(function () {
        $("#sendButton").one('click', function () {
            // disable button
            $(this).prop("disabled", true);
            // add spinner to button
            $(this).html(
                '<span class="spinner-border  mx-3  spinner-border-sm" role="status" aria-hidden="true"></span>'
            );
            setTimeout(function () {
                /*submit the form after 5 secs*/
                document.getElementById('messageForm').submit();
            }, 2000)
        });
    });
}

