// Tarayıcının yüksekliğini hesaplama
function appHeight() {
    const e = document.documentElement;
    e.style.setProperty("--vh", .01 * window.innerHeight + "px")
}

window.addEventListener("resize", appHeight), appHeight();