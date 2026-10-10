
document.querySelectorAll(".project-gallery").forEach((gallery) => {
    const slides = [...gallery.querySelectorAll(".gallery-slide")];
    const originalSlideContents = slides.map((slide) => slide.innerHTML);
    const thumbnails = [...gallery.querySelectorAll(".gallery-thumb")];
    const prevButton = gallery.querySelector(".gallery-prev");
    const nextButton = gallery.querySelector(".gallery-next");
    const counter = gallery.querySelector(".gallery-counter");

    let currentIndex = 0;

    if (slides.length === 0) return;

    // Create a reusable image lightbox for this gallery.
    const lightbox = document.createElement("dialog");
    lightbox.className = "gallery-lightbox";

    lightbox.innerHTML = `
        <button class="lightbox-close"
                type="button"
                aria-label="Close enlarged image">&times;</button>
        <img class="lightbox-image" alt="">
        <p class="lightbox-caption"></p>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    function showSlide(index) {
        // Wrap around at either end of the gallery.
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const isActive = i === currentIndex;

            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));

            if (!isActive && slide.querySelector("iframe")) {
                slide.innerHTML = originalSlideContents[i];
            }
        });

        thumbnails.forEach((thumbnail, i) => {
            const isActive = i === currentIndex;

            thumbnail.classList.toggle("active", isActive);

            if (isActive) {
                thumbnail.setAttribute("aria-current", "true");
            } else {
                thumbnail.removeAttribute("aria-current");
            }
        });

        if (counter) {
            counter.textContent =
                `${currentIndex + 1} / ${slides.length}`;
        }
    }

    prevButton?.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => {
            showSlide(index);
        });
    });

    // Open the YouTube video inside its current slide.
   gallery.addEventListener("click", (event) => {
        const button = event.target.closest(".video-preview");

        if (!button || !gallery.contains(button)) return;

        const slide = button.closest(".gallery-slide");
        const videoId = slide.dataset.videoId;

        if (!videoId || !slide.classList.contains("active")) return;

        const iframe = document.createElement("iframe");

        iframe.src =
            `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;

        iframe.title = "Project demonstration video";

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

        iframe.allowFullscreen = true;

        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        slide.replaceChildren(iframe);
    });

    // Enlarge an image when clicked.
    gallery.querySelectorAll(".gallery-image").forEach((image) => {
        image.addEventListener("click", () => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxCaption.textContent = image.alt;

            lightbox.showModal();
        });
    });

    closeButton.addEventListener("click", () => {
        lightbox.close();
    });

    // Close if the visitor clicks the dark area outside the image.
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            lightbox.close();
        }
    });

    // Support keyboard navigation while the gallery has focus.
    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showSlide(currentIndex + 1);
        }
    });

    showSlide(0);
});
