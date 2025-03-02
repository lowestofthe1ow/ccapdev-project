window.addEventListener("load", async () => {
    /* Adds a submit event to the register / sign in form */
    document.querySelector(".register__form").addEventListener("submit", async (e) => {
        e.preventDefault(); /* Prevent redirect */

        let formData = {};
        new FormData(e.target).forEach((value, key) => (formData[key] = value));

        /* Make a POST request using the form data */
        const response = await fetch(e.target.action, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            
            body: JSON.stringify(formData),
        });

        console.log(response);

        const result = await response.json();

        const errorDiv = document.querySelector(".errormsg");
        errorDiv.textContent = "";

        if (result.success) {
            errorDiv.classList.add("hidden");
            window.location.href = result.redirectUrl;
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.remove("hidden");
            if(result.sessionExists){
                window.location.href = result.redirectUrl;
            }
        }
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
});
