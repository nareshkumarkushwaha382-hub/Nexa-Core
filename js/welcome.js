document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("get-started-btn");
    const welcome = document.getElementById("welcome-screen");
    const auth = document.getElementById("auth-screen");

    console.log("[Nexa] welcome.js loaded");
    console.log("[Nexa] Button:", button);
    console.log("[Nexa] Welcome:", welcome);
    console.log("[Nexa] Auth:", auth);

    if (!button) {
        console.error("[Nexa] Get Started button NOT FOUND");
        return;
    }

    button.onclick = function () {
        console.log("[Nexa] Get Started clicked");

        welcome.classList.remove("active");
        welcome.classList.add("hidden");

        auth.classList.remove("hidden");
        auth.classList.add("active");

        console.log("[Nexa] Welcome → Authentication");
    };
});
