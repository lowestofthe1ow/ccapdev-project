async function submitForm(formId, url, successCallback) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById("name").value,
            password: document.getElementById("password").value,
            confirm: document.getElementById("confirm") ? document.getElementById("confirm").value : undefined
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        const errorDiv = document.getElementById("errorMessages");
        errorDiv.textContent = "";

        if (result.success) {
            errorDiv.style.display = "none";
            if (successCallback) 
                successCallback(result);
        } else {
            errorDiv.textContent = result.message;
            errorDiv.style.display = "block"; 
        }
    });
}

function togglePassword(id) {
    let input = document.getElementById(id);
    let button = input.nextElementSibling; 
    let icon = button.querySelector("span"); 
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility"; 
    } else {
        input.type = "password";
        icon.textContent = "visibility_off";
    }
}
