import send_request from "/js/send_request.js";

/* Adds a submit event to the register / sign in form */
document.querySelector(".register__form").addEventListener("submit", async (e) => {
    e.preventDefault(); /* Prevent redirect */

    let formData = {};
    new FormData(e.target).forEach((value, key) => (formData[key] = value));

    /* Make a POST request using the form data */
    send_request(e.target.action, JSON.stringify(formData));
});

/* Allows for toggling password visibility */
document.querySelectorAll("[data-toggle-password]").forEach((x) => {
    x.addEventListener("click", () => {
        let input = document.querySelector(x.dataset.togglePassword);
        let icon = x.querySelector("span");

        if (input.type === "password") {
            input.type = "text";
            icon.textContent = "visibility";
        } else {
            input.type = "password";
            icon.textContent = "visibility_off";
        }
    });
});
