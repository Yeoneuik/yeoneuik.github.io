(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.querySelector(".slide-counter");
  const hint = document.querySelector(".hint");
  const introVideo = document.getElementById("intro-video");
  const total = slides.length;
  let index = 0;
  let touchStartX = 0;

  const SLIDE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"];
  const SLIDE_BASE = "../assets/busan/";

  document.querySelectorAll("img[data-slide]").forEach(function (img) {
    const name = img.dataset.slide;
    if (!name) return;

    let extIndex = 0;

    function tryExtension() {
      if (extIndex >= SLIDE_EXTENSIONS.length) return;
      const url = SLIDE_BASE + name + "." + SLIDE_EXTENSIONS[extIndex++];
      const probe = new Image();
      probe.onload = function () {
        img.src = url;
      };
      probe.onerror = tryExtension;
      probe.src = url;
    }

    tryExtension();
  });

  const NEXT_KEYS = new Set([
    "ArrowRight",
    "ArrowDown",
    " ",
    "Spacebar",
    "Enter",
    "PageDown",
  ]);
  const PREV_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);

  function updateCounter() {
    if (counter) {
      counter.textContent = `${index + 1} / ${total}`;
    }
  }

  function hideHint() {
    if (hint) {
      hint.classList.add("hidden");
    }
  }

  function resetIntroAtStart() {
    if (!introVideo || index !== 0) return;
    introVideo.pause();
    introVideo.muted = false;
    introVideo.currentTime = 0;
  }

  function resumeIntroOnReturn() {
    if (!introVideo || index !== 0) return;
    introVideo.muted = false;

    if (introVideo.ended) {
      introVideo.currentTime = 0;
      introVideo.pause();
      return;
    }

    if (introVideo.currentTime > 0) {
      const playPromise = introVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
      return;
    }

    introVideo.pause();
  }

  function stopIntro() {
    if (!introVideo) return;
    introVideo.pause();
    introVideo.muted = true;
    introVideo.blur();
  }

  function playIntro() {
    if (!introVideo) return;
    introVideo.muted = false;
    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function handleIntroNext() {
    if (!introVideo) {
      goToNextSlide();
      return;
    }

    if (introVideo.ended || !introVideo.paused) {
      goToNextSlide();
      return;
    }

    playIntro();
  }

  function requestPresentationFullscreen() {
    if (document.fullscreenElement) {
      return Promise.resolve();
    }

    const el = document.documentElement;
    const request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;

    if (!request) {
      return Promise.resolve();
    }

    return Promise.resolve(request.call(el)).catch(function () {});
  }

  let fullscreenRequested = false;

  function tryFirstFullscreen() {
    if (fullscreenRequested) return;
    fullscreenRequested = true;
    requestPresentationFullscreen();
  }

  document.addEventListener("touchstart", tryFirstFullscreen, { passive: true });
  requestPresentationFullscreen();

  if (introVideo) {
    introVideo.addEventListener("play", function () {
      if (index !== 0) {
        stopIntro();
      }
    });
  }

  function showSlide(newIndex) {
    if (newIndex < 0 || newIndex >= total || newIndex === index) return false;

    slides[index].classList.remove("active");
    index = newIndex;
    slides[index].classList.add("active");
    updateCounter();
    hideHint();

    if (index !== 0) {
      stopIntro();
    } else {
      resumeIntroOnReturn();
    }

    return true;
  }

  function tryClosePresentation() {
    function attemptClose() {
      window.close();
    }

    if (document.fullscreenElement) {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      if (exit) {
        Promise.resolve(exit.call(document)).finally(attemptClose);
        return;
      }
    }

    attemptClose();
  }

  function goToNextSlide() {
    if (index < total - 1) {
      showSlide(index + 1);
      return;
    }
    tryClosePresentation();
  }

  function next() {
    if (index === 0) {
      handleIntroNext();
      return;
    }
    goToNextSlide();
  }

  function prev() {
    if (index > 0) {
      showSlide(index - 1);
    }
  }

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.repeat) return;
      tryFirstFullscreen();

      if (NEXT_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        next();
        return;
      }

      if (PREV_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        prev();
      }
    },
    true
  );

  document.addEventListener(
    "click",
    function (e) {
      if (index === 0 && introVideo && introVideo.contains(e.target)) {
        e.preventDefault();
      }
      next();
      tryFirstFullscreen();
    },
    true
  );

  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    function (e) {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(deltaX) < 40) return;
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    },
    { passive: true }
  );

  updateCounter();
  resetIntroAtStart();
})();
