window.addEventListener("load", async () => {
    document.querySelector("#profile-editor").addEventListener("submit", async (e) => {
        e.preventDefault(); /* Prevent redirect */
    
        console.log("this is working");
    
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
    
        const result = await response.json();
    
        const errorDiv = document.querySelector(".errormsg");
        errorDiv.textContent = "";
    
        if (result.success) {
            errorDiv.classList.add("hidden");
            window.location.href = result.redirectUrl;
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.remove("hidden");
            window.location.href = result.redirectUrl;
        }
    });
});