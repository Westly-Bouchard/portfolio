async function include(selector, url) {
    // Find div with selector
    const el = document.querySelector(selector);
    if (!el) return;

    // Fetch content to put there
    const res = await fetch(url);

    // Put the content there
    el.innerHTML = await res.text();
}

include("#footer", "/partials/footer.html");
