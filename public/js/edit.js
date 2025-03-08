import send_edit_request from "/js/send_request.js";

document.querySelector("#profile-editor").addEventListener("submit", async (e) => {
    e.preventDefault(); /* Prevent redirect */

    let formData = {};
    new FormData(e.target).forEach((value, key) => (formData[key] = value));

    /* Make a POST request using the form data */
    send_edit_request("/profile/edit", JSON.stringify(formData));
});

document.querySelector("#clear-banner").addEventListener("click", () => {
    console.log("hi");
    send_edit_request("/profile/edit", JSON.stringify({ banner: "" }));
});
