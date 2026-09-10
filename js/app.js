(() => {
  const header = document.getElementById("nav");
  const burger = document.querySelector(".burger");
  const drawer = document.getElementById("drawer");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!drawer || !burger) return;
    drawer.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    drawer.hidden = open;
    document.body.classList.toggle("menu-open", !open);
  });

  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el, index) => {
      el.style.setProperty("--delay", `${(index % 3) * 90}ms`);
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-open");
      const article = document.getElementById(id);
      if (!article) return;
      const expanded = article.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "Zatvori" : "Pročitaj cijeli opis";
    });
  });

  const blogLinks = () => [...document.querySelectorAll(".blog-nav a")];

  const setActiveBlogLink = (id) => {
    blogLinks().forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveBlogLink(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    const observeArticles = () => {
      document.querySelectorAll(".article[id]").forEach((article) => spy.observe(article));
      const initial = location.hash.replace("#", "") || document.querySelector(".article[id]")?.id;
      if (initial) setActiveBlogLink(initial);
    };

    observeArticles();

    const articlesRoot = document.querySelector(".articles__list");
    if (articlesRoot) {
      const mo = new MutationObserver(() => observeArticles());
      mo.observe(articlesRoot, { childList: true });
    }
  }

  const fan = document.querySelector(".hero__fan");
  if (fan) {
    const mobileFan = window.matchMedia("(max-width: 899px)");

    const openFan = () => {
      if (!mobileFan.matches) {
        fan.classList.remove("is-open");
        return;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => fan.classList.add("is-open"));
      });
    };

    if ("IntersectionObserver" in window) {
      const fanWatch = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) openFan();
          });
        },
        { threshold: 0.4 }
      );
      fanWatch.observe(fan);
    } else {
      openFan();
    }

    mobileFan.addEventListener("change", () => {
      if (!mobileFan.matches) fan.classList.remove("is-open");
    });

    const cards = [...fan.querySelectorAll(".hero__card")];
    let settling = false;
    let settleTimer = 0;

    const clearFront = () => {
      const front = cards.find((card) => card.classList.contains("is-front"));
      const wasOpen = fan.classList.contains("is-peeking") || Boolean(front);

      fan.classList.remove("is-peeking");
      cards.forEach((card) => {
        card.classList.remove("is-front", "is-returning");
        card.setAttribute("aria-current", "false");
      });

      if (!wasOpen) return;

      if (front) {
        front.classList.add("is-returning");
        window.setTimeout(() => {
          front.classList.remove("is-returning");
        }, 220);
      }

      settling = true;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settling = false;
      }, 500);
    };

    const setFront = (index) => {
      if (settling) return;
      fan.classList.add("is-peeking");
      cards.forEach((card, i) => {
        const active = i === index;
        card.classList.toggle("is-front", active);
        card.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    cards.forEach((card, i) => {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Povećaj sliku ${i + 1} od ${cards.length}`);
      card.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (settling || fan.classList.contains("is-peeking")) return;
        setFront(i);
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (settling || fan.classList.contains("is-peeking")) clearFront();
          else setFront(i);
        }
      });
    });

    document.addEventListener(
      "pointerdown",
      () => {
        if (fan.classList.contains("is-peeking")) clearFront();
      },
      true
    );

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") clearFront();
    });
  }
})();
