document.addEventListener("DOMContentLoaded", () => {

    const mainImage = document.getElementById("photo-main");
    const thumbs = document.querySelectorAll(".thumb");

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            const newSrc = thumb.dataset.full;
            mainImage.src = newSrc;
        });
    });

});
