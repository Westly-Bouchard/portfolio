async function include(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    const res = await fetch(url);
    el.innerHTML = await res.text();
}

include("#navbar", "/partials/navbar.html");