(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const sections = [...document.querySelectorAll("section[id]")];

  /* Mobile navigation */
  navToggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("overflow-hidden", open);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    });
  });

  /* Header background on scroll */
  const onScroll = () => {
    // header?.classList.toggle("is-scrolled", window.scrollY > 40);
    updateActiveNav();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active nav link */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id ?? "home";
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) current = section.id;
    }
    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("is-active", target === current);
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("services-carousel");
    const carouselTrack = document.getElementById("services-track");
    const desktopDots = document.querySelectorAll("[data-dot-desktop]");
    const mobileDots = document.querySelectorAll("[data-dot-mobile]");

    if (!carouselTrack) return;

    const cards = carouselTrack.children;
    let carouselIndex = 0;
    let autoplay;

    function isMobile() {
      return window.innerWidth < 1024; // lg breakpoint
    }

    function goToSlide(index) {
      if (isMobile()) {
        // Mobile logic: 4 dots handles 6 cards smoothly step by step
        carouselIndex = Math.max(0, Math.min(index, mobileDots.length - 1));

        // Calculate exact card offset to scroll
        if (cards[carouselIndex]) {
          const gap = 24; // Tailwind gap-6 is 24px
          const cardWidth = cards[0].offsetWidth;
          const shift = carouselIndex * (cardWidth + gap);

          carouselTrack.scrollTo({
            left: shift,
            behavior: 'smooth'
          });
        }
        updateDots(mobileDots, carouselIndex);
      } else {
        // Desktop logic: 2 views (Dots 0 and 1)
        carouselIndex = index === 1 ? 1 : 0;

        // Slide 1 shows cards 1,2,3. Slide 2 shifts to show 4,5,6 (index 3)
        const shiftAmount = (carouselIndex === 1 && cards[2]) ? cards[2].offsetLeft : 0;
        carouselTrack.style.transform = `translateX(-${shiftAmount}px)`;

        updateDots(desktopDots, carouselIndex);
      }
    }

    function updateDots(dotsGroup, activeIndex) {
      dotsGroup.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("is-active", "bg-green-500");
          dot.classList.remove("bg-gray-300");
        } else {
          dot.classList.remove("is-active", "bg-green-500");
          dot.classList.add("bg-gray-300");
        }
      });
    }

    // Desktop dots click handler
    desktopDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goToSlide(i);
        resetAutoplay();
      });
    });

    // Mobile dots click handler
    mobileDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goToSlide(i);
        resetAutoplay();
      });
    });

    // Autoplay Logic
    function startAutoplay() {
      autoplay = setInterval(() => {
        const maxIndex = isMobile() ? mobileDots.length - 1 : 1;
        let nextIndex = carouselIndex + 1;
        if (nextIndex > maxIndex) nextIndex = 0;
        goToSlide(nextIndex);
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
    carousel.addEventListener("mouseleave", startAutoplay);

    // Mobile touch swipe tracker to auto-light up mobile dots
    let scrollTimeout;
    carouselTrack.addEventListener("scroll", () => {
      if (!isMobile()) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cardWidthWithGap = cards[0].offsetWidth + 24;
        const currentIndex = Math.round(carouselTrack.scrollLeft / cardWidthWithGap);
        const safeIndex = Math.min(currentIndex, mobileDots.length - 1);

        if (safeIndex !== carouselIndex) {
          carouselIndex = safeIndex;
          updateDots(mobileDots, carouselIndex);
        }
      }, 100);
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) {
        carouselTrack.style.transform = `translateX(0px)`;
      }
      goToSlide(carouselIndex);
    });

    startAutoplay();
    goToSlide(0);
  });

  document.addEventListener('DOMContentLoaded', () => {
    // අවශ්‍ය Elements තෝරාගැනීම
    const planCards = document.querySelectorAll('[data-plan-card]');
    const tierPanels = document.querySelectorAll('.tier-panel');
    const sectionTitle = document.getElementById('tier-section-title');
    const sectionDesc = document.getElementById('tier-section-desc');

    // එක් එක් Plan එකට අදාළ Titles සහ Descriptions
    const tierContent = {
      'gold-monthly': {
        title: 'Prime <span class="text-lime">Gold</span> (Monthly) Tiers',
        desc: 'Review specific numbers for your monthly profit options below.'
      },
      'gold-maturity': {
        title: 'Prime <span class="text-lime">Gold</span> (Maturity) Tiers',
        desc: 'See how your investment grows with compounded returns at maturity.'
      },
      'platinum': {
        title: 'Double <span class="text-lime">Platinum</span> Tiers',
        desc: 'Choose your entry level to safely double your wealth in 3 years.'
      },
      'benefits': {
        title: 'Double <span class="text-lime">Benefits</span> Tiers',
        desc: 'Select your monthly contribution to double your fund in 5 years.'
      }
    };

    planCards.forEach(card => {
      card.addEventListener('click', function (e) {
        // Button එකක් Click කළා නම් Page එක Scroll වීම නැවැත්වීමට (අවශ්‍ය නම් පමණක්)
        e.preventDefault();

        const planId = this.getAttribute('data-plan-card');

        // 1. Cards වල Style වෙනස් කිරීම (Highlight කිරීම)
        planCards.forEach(c => {
          c.classList.remove('ring-4', 'ring-lime', 'opacity-100');
          c.classList.add('opacity-80');
        });
        this.classList.remove('opacity-80');
        this.classList.add('ring-4', 'ring-lime', 'opacity-100');

        // 2. සියලුම Tables Hide කිරීම
        tierPanels.forEach(panel => {
          panel.classList.add('hidden');
        });

        // 3. අදාළ Table එක Show කිරීම
        const activePanel = document.querySelector(`[data-tier-panel="${planId}"]`);
        if (activePanel) {
          activePanel.classList.remove('hidden');
        }

        // 4. Title එක සහ Description එක Update කිරීම
        if (tierContent[planId]) {
          if (sectionTitle) sectionTitle.innerHTML = tierContent[planId].title;
          if (sectionDesc) sectionDesc.innerHTML = tierContent[planId].desc;
        }
      });
    });
  });

  /* Investment plan cards – select highlight */
  document.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-plan-card]").forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      const plan = card.dataset.planCard;
      document.querySelectorAll("[data-tier-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.tierPanel !== plan);
      });
    });
  });

  /* Tier table row highlight */
  document.querySelectorAll("[data-tier-row]").forEach((row) => {
    row.addEventListener("mouseenter", () => row.classList.add("is-highlighted"));
    row.addEventListener("mouseleave", () => row.classList.remove("is-highlighted"));
  });

  /* Video modal */
  const videoModal = document.getElementById("video-modal");
  const videoOpen = document.getElementById("video-open");
  const videoClose = document.getElementById("video-close");
  const videoIframe = document.querySelector("[data-video-iframe]");
  const videoUrl = "https://www.youtube.com/embed/ovSBBaw8d3Q?autoplay=1&rel=0";

  videoOpen?.addEventListener("click", () => {
    if (videoIframe) videoIframe.src = videoUrl;
    videoModal?.classList.add("is-open");
    videoModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  });

  const closeVideo = () => {
    if (videoIframe) videoIframe.src = "about:blank";
    videoModal?.classList.remove("is-open");
    videoModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
  };
  videoClose?.addEventListener("click", closeVideo);
  videoModal?.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideo();
  });

  /* Contact form */
  const form = document.getElementById("contact-form");
  const formToast = document.getElementById("form-toast");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (!name || !email || !email.includes("@")) {
      showToast("Please fill in your name and a valid email.", "error");
      return;
    }
    showToast("Thank you! Our team will respond within 24 hours.", "success");
    form.reset();
  });

  function showToast(message, type) {
    if (!formToast) return;
    formToast.textContent = message;
    formToast.className = `form-toast is-visible is-${type}`;
    setTimeout(() => formToast.classList.remove("is-visible"), 4000);
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Explore tiers buttons */
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
