const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 280)}ms`;
  revealObserver.observe(element);
});

const siteNav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".menu-links a");

const closeMenu = () => {
  siteNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (siteNav && !siteNav.contains(event.target)) {
    closeMenu();
  }
});

const launchModal = document.getElementById("launch-modal");
const launchForm = document.getElementById("launch-form");
const openLaunchModalButtons = document.querySelectorAll("[data-open-launch-modal]");
const closeLaunchModalButtons = document.querySelectorAll("[data-close-launch-modal]");

const openLaunchModal = () => {
  if (!launchModal) return;
  launchModal.classList.add("is-open");
  launchModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  launchModal.querySelector("input")?.focus();
};

const closeLaunchModal = () => {
  if (!launchModal) return;
  launchModal.classList.remove("is-open");
  launchModal.setAttribute("aria-hidden", "true");
  document.body.style.removeProperty("overflow");
};

openLaunchModalButtons.forEach((button) => {
  button.addEventListener("click", openLaunchModal);
});

closeLaunchModalButtons.forEach((button) => {
  button.addEventListener("click", closeLaunchModal);
});

launchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  closeLaunchModal();
  launchForm.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && launchModal?.classList.contains("is-open")) {
    closeLaunchModal();
  }
});

const testimonialsStack = document.querySelector("[data-draggable]");

if (testimonialsStack) {
  const cards = Array.from(testimonialsStack.querySelectorAll(".testimonial-card"));
  const prevButton = document.querySelector('[data-testimonial-nav="prev"]');
  const nextButton = document.querySelector('[data-testimonial-nav="next"]');
  let activeIndex = 0;
  let isDown = false;
  let startX = 0;
  let deltaX = 0;

  const paintCards = () => {
    cards.forEach((card, index) => {
      const offset = (index - activeIndex + cards.length) % cards.length;
      card.classList.remove("is-active", "is-next", "is-third", "is-fourth");

      if (offset === 0) card.classList.add("is-active");
      if (offset === 1) card.classList.add("is-next");
      if (offset === 2) card.classList.add("is-third");
      if (offset === 3) card.classList.add("is-fourth");
    });
  };

  paintCards();

  const goToNext = () => {
    activeIndex = (activeIndex + 1) % cards.length;
    paintCards();
  };

  const goToPrev = () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    paintCards();
  };

  const beginDrag = (pageX) => {
    isDown = true;
    testimonialsStack.classList.add("is-dragging");
    startX = pageX;
    deltaX = 0;
  };

  const moveDrag = (pageX) => {
    if (!isDown) return;
    deltaX = pageX - startX;
  };

  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    testimonialsStack.classList.remove("is-dragging");

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  testimonialsStack.addEventListener("mousedown", (event) => beginDrag(event.pageX));
  testimonialsStack.addEventListener("mousemove", (event) => {
    event.preventDefault();
    moveDrag(event.pageX);
  });
  testimonialsStack.addEventListener("mouseleave", endDrag);
  testimonialsStack.addEventListener("mouseup", endDrag);

  testimonialsStack.addEventListener("touchstart", (event) => beginDrag(event.touches[0].pageX), { passive: true });
  testimonialsStack.addEventListener("touchmove", (event) => moveDrag(event.touches[0].pageX), { passive: true });
  testimonialsStack.addEventListener("touchend", endDrag);

  prevButton?.addEventListener("click", goToPrev);
  nextButton?.addEventListener("click", goToNext);
}
