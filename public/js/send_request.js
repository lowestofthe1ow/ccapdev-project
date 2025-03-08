/**
 * Sends a POST request with {@link fetch} to a URL. Used in registration, sign-in, and edit profile
 * @param {string} url - The URL to send a fetch request to
 * @param {JSON} body - The JSON body to use in the request
 */
export default async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: body,
    });

    const result = await response.json();

    const error_div = document.querySelector(".errormsg");
    error_div.textContent = "";

    if (result.success) {
        error_div.classList.add("hidden");
        window.location.href = result.redirectUrl;
    } else {
        error_div.textContent = result.message;
        error_div.classList.remove("hidden");
        if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
        }
    }
};
