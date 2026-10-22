/* 햄버거 메뉴 */
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".trigger");
  const mobileMenu = document.querySelector(".mobile_menu");
  const overlay = document.querySelector(".mobile_overlay");
  const body = document.body;
  if (!trigger || !mobileMenu || !overlay) return;

  // 메뉴 열기 / 닫기
  function toggleMenu(isOpen) {
    body.classList.toggle("menu_open", isOpen);
    trigger.classList.toggle("active", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute(
      "aria-label",
      isOpen ? "메뉴 닫기" : "메뉴 열기"
    );
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));}
  // 햄버거 버튼 클릭
  trigger.addEventListener("click", () => {
    const isOpen = !body.classList.contains("menu_open");
    toggleMenu(isOpen);
  });
  // 어두운 배경 클릭 시 닫기
  overlay.addEventListener("click", () => {
    toggleMenu(false);
  });
  // ESC 키를 누르면 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });

  // 메뉴 항목 선택 시 닫기
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });
  // PC 화면으로 전환되면 메뉴 닫기
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {toggleMenu(false);}
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".header_slider");
  if (!slider) return;

  const track = slider.querySelector(".header_slider_track");
  const prevBtn = slider.querySelector(".slider_prev");
  const nextBtn = slider.querySelector(".slider_next");

  if (!track) return;

  const originalSlides = Array.from(track.querySelectorAll("li"));

  if (originalSlides.length <= 1) return;

  // 첫 번째 슬라이드를 복제해서 맨 뒤에 추가
  const firstClone = originalSlides[0].cloneNode(true);
  firstClone.setAttribute("aria-hidden", "true");
  track.appendChild(firstClone);

  const totalSlides = originalSlides.length;
  let currentIndex = 0;
  let autoSlide;
  let isMoving = false;

  function moveSlide(index) {
    if (isMoving) return;

    isMoving = true;
    currentIndex = index;

    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform =
      `translateX(-${currentIndex * 100}%)`;
  }

  // 마지막 복제 슬라이드에서 실제 첫 번째 슬라이드로 순간 이동
  track.addEventListener("transitionend", () => {
    if (currentIndex === totalSlides) {
      track.style.transition = "none";
      currentIndex = 0;
      track.style.transform = "translateX(0)";

      // 순간 이동을 즉시 적용
      track.offsetHeight;
    }

    isMoving = false;
  });

  function nextSlide() {
    if (!isMoving) moveSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (!isMoving) {
      if (currentIndex === 0) {
        // 첫 번째에서 이전 버튼을 누르면 마지막 문구로 이동
        track.style.transition = "none";
        currentIndex = totalSlides;
        track.style.transform =
          `translateX(-${currentIndex * 100}%)`;

        track.offsetHeight;
      }

      moveSlide(currentIndex - 1);
    }
  }

  function stopAutoSlide() {
    clearInterval(autoSlide); }
  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(() => {
      nextSlide();
    }, 4000); }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide(); }); }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  }

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
  slider.addEventListener("focusin", stopAutoSlide);
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) {
      startAutoSlide();
    }
  });

  moveSlide(0);
  startAutoSlide();
});






document.addEventListener("DOMContentLoaded", () => {
  const brandGrid = document.querySelector(".brand_grid");
  if (!brandGrid) return;
  const mobileQuery = window.matchMedia("(max-width: 480px)");
  // 화면 크기에 따라 모바일 클래스 적용
  function updateBrandLayout(event) {
    brandGrid.classList.toggle("mobile_layout", event.matches);
  }
  mobileQuery.addEventListener("change", updateBrandLayout);
  // 처음 페이지가 열렸을 때도 적용
  updateBrandLayout(mobileQuery);
});



document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // 모션 줄이기 설정이면 애니메이션 안 함
  mm.add("(prefers-reduced-motion: no-preference)", () => {

    // 1) 헤더 인트로
    gsap.from([".logo", ".nav_wrap li", ".header_util a", ".trigger"], {
      y: -20, autoAlpha: 0, duration: 0.8,
      stagger: 0.08, ease: "power3.out"
    });

    // 2) 카테고리
    gsap.from(".category_item", {
      y: 60, autoAlpha: 0, duration: 1, stagger: 0.2, ease: "power3.out",
      scrollTrigger: { trigger: ".category_section", start: "top 75%", once: true }
    });

    // 3) 소도구: 좌우 교차 등장
    gsap.utils.toArray(".equipment_item").forEach((item) => {
      const fromX = item.classList.contains("reverse") ? 60 : -60;
      gsap.from(item.children, {
        x: fromX, autoAlpha: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 80%", once: true }
      });
    });

    // 4) 브랜드 그리드
    gsap.from(".brand_grid > *", {
      autoAlpha: 0, y: 40, duration: 0.8,
      stagger: { each: 0.06, from: "start" }, ease: "power2.out",
      scrollTrigger: { trigger: ".brand_grid", start: "top 80%", once: true }
    });

    // 5) 리뷰: 선이 그려지는 효과
    gsap.utils.toArray(".review_item").forEach((item) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: "top 80%", once: true }
      });
      tl.from(item.querySelector(".review_text"), { y: 30, autoAlpha: 0, duration: 0.7 })
        .from(item.querySelector(".review_line span"),
          { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power2.inOut" }, "-=0.3")
        .from(item.querySelector(".review_image"), { x: 40, autoAlpha: 0, duration: 0.7 }, "-=0.5");
    });

    // 6) MORE THAN MOVEMENT: 제목 + 패럴랙스
    gsap.from(".movement_heading > *", {
      y: 30, autoAlpha: 0, stagger: 0.15, duration: 0.8,
      scrollTrigger: { trigger: ".movement_heading", start: "top 80%", once: true }
    });

    gsap.utils.toArray(".movement_photo").forEach((photo, i) => {
      gsap.to(photo, {
        yPercent: i % 2 === 0 ? -8 : 8, ease: "none",
        scrollTrigger: {
          trigger: ".movement_gallery",
          start: "top bottom", end: "bottom top", scrub: true
        }
      });
    });

    // 7) 푸터
    gsap.from(".oya_footer .footer_info, .oya_footer .footer_feature", {
      y: 40, autoAlpha: 0, stagger: 0.2, duration: 0.9,
      scrollTrigger: { trigger: ".oya_footer", start: "top 85%", once: true }
    });
  });
});