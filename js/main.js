/* IIFE GLOBAL */
(() => {
  "use strict";

  /* menú */
  /* la mayoria de las funciones y clases de este proyecto las puse en inglés por que investigué que se trata de buenas practicas */
  const body = document.body;
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  const navLinks = document.querySelectorAll(".nav__link");
  let isMenuOpen = false;

  /* año dinamico del footer */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* abre y cierra el menú */
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    body.classList.toggle("is-menu-open", isMenuOpen);

    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(isMenuOpen));
    if (menuPanel) menuPanel.setAttribute("aria-hidden", String(!isMenuOpen));
  }

  if (menuBtn) menuBtn.addEventListener("click", toggleMenu);

  /* links del menú: ir a sección y cerrar menú en mobile */
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      if (isMenuOpen) {
        isMenuOpen = false;
        body.classList.remove("is-menu-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        if (menuPanel) menuPanel.setAttribute("aria-hidden", "true");
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* modal de proyectos */
  /* me ayudé con chat gppt para crear este modal: el prompt que utilicé es éste Hazme un modal sencillo para mi portafolio, cuando haga clic en un proyecto, se abre una ventana encima con el detalle del proyecto (título, descripción, lista de puntos e imagen) Que tenga un botón para cerrar y que se pueda cerrar haciendo clic fuera. Dame el HTML y el JavaScript necesarios.*/
  const projects = document.querySelectorAll("[data-project]");
  const modal = document.querySelector("[data-modal]");
  const modalCloseBtn = document.querySelector("[data-modal-close]");
  const modalText = document.querySelector("[data-modal-text]");
  const modalList = document.querySelector("[data-modal-list]");
  const modalImg = document.querySelector("[data-modal-img]");
  let lastFocus = null;

  const projectData = {
    brand: {
      title: "identidad para marca INDRA",
      text: "",
      list: ["Diseño de marca INDRA", "Paleta de colores y tipografía"],
    },
    ui: {
      title: "logotipo para AG Monogram",
      text: "",
      list: ["Logotipopara marca AG con sus variaciones de color"],
    },
    editorial: {
      title: "Yayoi Kusama Book",
      text: "Redefinición editorial del arte de la obsesion de Yayoi Kusama ",
      list: ["Diseño editorial"],
    },
  };

  projects.forEach((card) => {
    card.addEventListener("click", () => {
      if (!modal) return;

      const id = card.getAttribute("data-project-id");
      const info = projectData[id];
      if (!info) return;

      lastFocus = document.activeElement;

      const titleEl = modal.querySelector("#modal-title");
      if (titleEl) titleEl.textContent = info.title;
      if (modalText) modalText.textContent = info.text;

      if (modalList) {
        modalList.innerHTML = "";
        info.list.forEach((txt) => {
          const li = document.createElement("li");
          li.textContent = txt;
          modalList.appendChild(li);
        });
      }

      // copiar la misma imagen de la tarjeta
      const cardImg = card.querySelector("img");
      if (cardImg && modalImg) {
        modalImg.src = cardImg.src;
        modalImg.alt = cardImg.alt || "Imagen del proyecto";
      }

      modal.showModal();
      if (modalCloseBtn) modalCloseBtn.focus();
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.close();
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* formulario */
  const form = document.querySelector("[data-contact-form]");
  const formHint = document.querySelector("#form-hint");

  if (form) {
    form.addEventListener("submit", (event) => {
      const nameEl = form.querySelector("#name");
      const emailEl = form.querySelector("#email");
      const subjectEl = form.querySelector("#subject");
      const messageEl = form.querySelector("#message");

      const nameOk = nameEl && nameEl.value.trim() !== "";
      const emailOk = emailEl && emailEl.value.trim() !== "";
      const subjectOk = subjectEl && subjectEl.value.trim() !== "";
      const messageOk = messageEl && messageEl.value.trim() !== "";

      if (!(nameOk && emailOk && subjectOk && messageOk)) {
        event.preventDefault();
        if (formHint) formHint.textContent = "Revisa los campos obligatorios.";

        if (!nameOk && nameEl) nameEl.focus();
        else if (!emailOk && emailEl) emailEl.focus();
        else if (!subjectOk && subjectEl) subjectEl.focus();
        else if (messageEl) messageEl.focus();

        return;
      }

      if (formHint) formHint.textContent = "Enviando…";
    });
  }

  /* scroll */
  const revealGroups = document.querySelectorAll("[data-reveal-group]");

  if (revealGroups.length) {
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-revealed");
          });
        },
        { threshold: 0.2 }
      );

      revealGroups.forEach((el) => obs.observe(el));
    } else {
      revealGroups.forEach((el) => el.classList.add("is-revealed"));
    }
  }

  /*carrusel */
  const carousel = document.querySelector("[data-carousel]");
  const carouselTrack = document.querySelector("[data-carousel-track]");
  const carouselPrev = document.querySelector("[data-carousel-prev]");
  const carouselNext = document.querySelector("[data-carousel-next]");
  const carouselRange = document.querySelector("[data-carousel-range]");
  const carouselCounter = document.querySelector("[data-carousel-counter]");

  let carouselIndex = 0;
  let carouselTimer = null;

  function goSlide(i, total) {
    carouselIndex = i;
    if (carouselIndex < 0) carouselIndex = total - 1;
    if (carouselIndex >= total) carouselIndex = 0;

    if (carouselTrack)
      carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    if (carouselRange) carouselRange.value = String(carouselIndex);
    if (carouselCounter)
      carouselCounter.textContent = `${carouselIndex + 1} / ${total}`;
  }

  function stopAuto() {
    if (!carouselTimer) return;
    clearInterval(carouselTimer);
    carouselTimer = null;
  }

  function startAuto(total) {
    stopAuto();
    carouselTimer = setInterval(() => {
      goSlide(carouselIndex + 1, total);
    }, 3000);
  }

  if (carousel && carouselTrack) {
    const slides = Array.from(carouselTrack.children);
    const total = slides.length;

    if (total >= 2) {
      if (carouselRange) carouselRange.max = String(total - 1);

      if (carouselPrev) {
        carouselPrev.addEventListener("click", () => {
          stopAuto();
          goSlide(carouselIndex - 1, total);
          startAuto(total);
        });
      }

      if (carouselNext) {
        carouselNext.addEventListener("click", () => {
          stopAuto();
          goSlide(carouselIndex + 1, total);
          startAuto(total);
        });
      }

      if (carouselRange) {
        carouselRange.addEventListener("input", (e) => {
          stopAuto();
          goSlide(Number(e.target.value), total);
          startAuto(total);
        });
      }

      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", () => startAuto(total));

      goSlide(0, total);
      startAuto(total);
    }
  }

  // boton en el footer que lleva a arriba nuevamente
  const topBtn = document.querySelector(".site-footer__top");

  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
