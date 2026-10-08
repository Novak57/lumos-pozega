(() => {
  if (!window.LumosSanity) return;

  // Privremeni fallback dok se Sanity ne napuni (npm run seed u studio/).
  const FALLBACK_CJENIK = {
    stavke: [
      {
        kpd: "86.93.00",
        sifra: "",
        naziv: "Individualna psihoterapija",
        opis: "60 minuta · uživo u Požegi ili online",
        jedinica: "sat",
        kolicina: "1",
        cijena: "50",
        sidrena: "50",
        popust: "0",
        porez: "0",
      },
      {
        kpd: "86.93.00",
        sifra: "",
        naziv: "Poklon bon",
        opis: "1 komad",
        jedinica: "kom",
        kolicina: "1",
        cijena: "50",
        sidrena: "50",
        popust: "0",
        porez: "0",
      },
      {
        kpd: "86.93.00",
        sifra: "",
        naziv: "Partnerska psihoterapija (75min)",
        opis: "75 minuta · uživo u Požegi ili online",
        jedinica: "kom",
        kolicina: "1",
        cijena: "80",
        sidrena: "80",
        popust: "0",
        porez: "0",
      },
      {
        kpd: "86.93.00",
        sifra: "",
        naziv: "Individualna psihoterapija na engleskom jeziku",
        opis: "60 minuta · uživo u Požegi ili online",
        jedinica: "sat",
        kolicina: "1",
        cijena: "60",
        sidrena: "60",
        popust: "0",
        porez: "0",
      },
      {
        kpd: "85.59.09",
        sifra: "",
        naziv: "Individualno pedagoško savjetovanje adolescenata",
        opis: "60 minuta · 16+ · uživo u Požegi ili online",
        jedinica: "sat",
        kolicina: "1",
        cijena: "50",
        sidrena: "50",
        popust: "0",
        porez: "0",
      },
    ],
    napomene: [
      "Plaćanje je moguće isključivo transakcijski. Gotovinsko plaćanje nije moguće.",
      "Otkazivanje termina moguće je najkasnije 6 sati prije dogovorenog termina. U slučaju kasnijeg otkazivanja ili nedolaska, termin se naplaćuje u cijelosti.",
      "Na prvom susretu klijenti potpisuju informirani pristanak (GDPR i pravila rada).",
    ],
  };

  const FALLBACK_EDUKACIJE = {
    stavke: [
      {
        godina: "2014.",
        tekst:
          "Početak edukacije iz realitetne terapije — Europski institut za realitetnu terapiju",
      },
      {
        godina: "2016.",
        tekst: "Magistra anglistike i pedagogije — Sveučilište u Zadru",
      },
      {
        godina: "2019.",
        tekst: "Početak rada s klijentima pod supervizijom",
      },
      {
        godina: "2025.",
        tekst:
          "Psihoterapeut realitetne terapije — Europska udruga za realitetnu terapiju",
      },
      {
        godina: "2025.",
        tekst:
          "Europski certifikat iz psihoterapije (ECP) — Europska udruga za psihoterapiju",
      },
      {
        godina: "2025.",
        tekst:
          "Upis u Imenik psihoterapeuta Hrvatske komore psihoterapeuta (HKPT)",
      },
      {
        godina: "2025.",
        tekst: "Vizualni dijalog: korištenje Dixit karti u savjetovanju — ZAMisli",
      },
      {
        godina: "2025.",
        tekst: "Theraplay & MIM Level 1 — The Theraplay Institute",
      },
      {
        godina: "2025.",
        tekst: "Osnove trauma-focused KBT-a — GBF Educa",
      },
      {
        godina: "2026.",
        tekst: "EMDR Level 1 — EMDR Hrvatska",
      },
    ],
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const slugify = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "objava";

  const portableTextToPlain = (blocks = []) => {
    if (!Array.isArray(blocks)) return "";
    return blocks
      .filter((block) => block?._type === "block")
      .map((block) =>
        (block.children || []).map((child) => child.text || "").join("")
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const excerptFromBody = (body, max = 160) => {
    const text = portableTextToPlain(body);
    if (!text) return "";
    if (text.length <= max) return text;
    return `${text.slice(0, max).trimEnd()}…`;
  };

  const normalizePost = (post) => {
    const title = post?.title || "";
    return {
      ...post,
      title,
      slug: slugify(title),
      excerpt: excerptFromBody(post?.body),
    };
  };

  const formatPrice = (value) => {
    const n = String(value ?? "").replace(",", ".").trim();
    if (!n) return "";
    return `${n.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")} €`;
  };

  const syncServicePrices = (stavke = []) => {
    document.querySelectorAll("[data-cjenik-naziv]").forEach((el) => {
      const naziv = el.getAttribute("data-cjenik-naziv") || "";
      const item = stavke.find((s) => s.naziv === naziv);
      if (!item) return;
      const price = formatPrice(item.cijena);
      if (price) el.textContent = price;
    });
  };

  const renderCjenik = (data) => {
    const list = document.getElementById("price-list");
    const stavke = data?.stavke || [];

    if (list) {
      list.innerHTML = stavke
        .map((item) => {
          const cijena = formatPrice(item.cijena);
          const sidrena = formatPrice(item.sidrena || item.cijena);
          return `
          <li
            data-kpd="${escapeHtml(item.kpd || "86.93.00")}"
            data-sifra="${escapeHtml(item.sifra || "")}"
            data-naziv="${escapeHtml(item.naziv || "")}"
            data-jedinica="${escapeHtml(item.jedinica || "sat")}"
            data-kolicina="${escapeHtml(item.kolicina || "1")}"
            data-popust="${escapeHtml(item.popust || "0")}"
            data-porez="${escapeHtml(item.porez || "0")}"
          >
            <div>
              <strong>${escapeHtml(item.naziv || "")}</strong>
              <span>${escapeHtml(item.opis || "")}</span>
            </div>
            <div class="price-list__amount">
              <em class="price-list__cijena">${escapeHtml(cijena)}</em>
              <small>Sidrena cijena: <span class="price-list__sidrena">${escapeHtml(sidrena)}</span></small>
            </div>
          </li>`;
        })
        .join("");
    }

    const notes = document.querySelector(".pricing__notes");
    if (notes && Array.isArray(data?.napomene)) {
      notes.innerHTML = data.napomene
        .map((note) => `<p>${escapeHtml(note)}</p>`)
        .join("");
    }

    syncServicePrices(stavke);
  };

  const renderEdukacije = (data) => {
    const list = document.getElementById("education-list");
    if (!list) return;

    list.innerHTML = (data?.stavke || [])
      .map(
        (item) => `
        <li>
          <span class="education__year">${escapeHtml(item.godina || "")}</span>
          <p>${escapeHtml(item.tekst || "")}</p>
        </li>`
      )
      .join("");
  };

  const renderBlogPreview = (posts) => {
    const root = document.getElementById("blog-preview");
    if (!root) return;

    if (!posts.length) {
      root.innerHTML = `
        <div class="blog-empty reveal is-visible">
          <p>Još nema objava. Novi zapisi stižu uskoro.</p>
          <a class="textlink" href="blog.html">Otvori blog</a>
        </div>`;
      return;
    }

    root.innerHTML = posts
      .slice(0, 2)
      .map((raw) => {
        const post = normalizePost(raw);
        return `
        <a class="post reveal is-visible" href="blog.html#${escapeHtml(post.slug)}">
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <span class="textlink">Pročitaj na blogu</span>
        </a>`;
      })
      .join("");
  };

  const renderBlogPage = (posts) => {
    const nav = document.getElementById("blog-nav-list");
    const list = document.getElementById("articles-list");
    const empty = document.getElementById("blog-empty");
    const status = document.getElementById("blog-status");
    if (!list) return;

    const setStatus = (message, isError = false) => {
      if (!status) return;
      status.hidden = !message;
      status.textContent = message || "";
      status.classList.toggle("is-error", isError);
    };

    const navWrap = nav?.closest(".blog-nav");
    const grid = list.closest(".articles__grid");

    if (!posts.length) {
      if (nav) nav.innerHTML = "";
      if (navWrap) navWrap.hidden = true;
      if (grid) grid.hidden = true;
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      setStatus("");
      return;
    }

    if (empty) empty.hidden = true;
    if (navWrap) navWrap.hidden = false;
    if (grid) grid.hidden = false;
    setStatus("");

    const normalized = posts.map(normalizePost);

    if (nav) {
      nav.innerHTML = normalized
        .map(
          (post) => `
          <li>
            <a href="#${escapeHtml(post.slug)}">
              ${escapeHtml(post.title)}
            </a>
          </li>`
        )
        .join("");
    }

    const toHtml =
      typeof window.portableTextToHtml === "function"
        ? window.portableTextToHtml
        : () => "";

    list.innerHTML = normalized
      .map((post, index) => {
        const prev = normalized[index - 1];
        const next = normalized[index + 1];
        const pager = next
          ? `<nav class="article__pager" aria-label="Sljedeći zapis">
              <a href="#${escapeHtml(next.slug)}">
                <span>Sljedeći zapis</span>
                ${escapeHtml(next.title)}
              </a>
            </nav>`
          : prev
            ? `<nav class="article__pager" aria-label="Prethodni zapis">
                <a class="article__pager--prev" href="#${escapeHtml(prev.slug)}">
                  <span>Prethodni zapis</span>
                  ${escapeHtml(prev.title)}
                </a>
              </nav>`
            : "";

        return `
          <article class="article reveal is-visible" id="${escapeHtml(post.slug)}">
            <h2>${escapeHtml(post.title)}</h2>
            <div class="article__body">
              ${toHtml(post.body)}
            </div>
            ${pager}
          </article>`;
      })
      .join("");

    if (location.hash) {
      const target = document.querySelector(location.hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const boot = async () => {
    const needsCjenik = Boolean(document.getElementById("price-list"));
    const needsEdu = Boolean(document.getElementById("education-list"));
    const needsBlogPreview = Boolean(document.getElementById("blog-preview"));
    const needsBlogPage = Boolean(document.getElementById("articles-list"));

    try {
      if (needsCjenik) {
        const data =
          (await window.LumosSanity.fetchQuery('*[_id == "cjenik"][0]')) ||
          FALLBACK_CJENIK;
        renderCjenik(data);
        if (location.hash === "#cjenik" && typeof window.LumosScrollToHash === "function") {
          window.LumosScrollToHash();
        }
      }
      if (needsEdu) {
        const data =
          (await window.LumosSanity.fetchQuery('*[_id == "edukacije"][0]')) ||
          FALLBACK_EDUKACIJE;
        renderEdukacije(data);
      }

      if (needsBlogPreview || needsBlogPage) {
        const posts =
          (await window.LumosSanity.fetchQuery(`*[_type == "post"] | order(publishedAt desc) {
            title,
            publishedAt,
            body
          }`)) || [];

        if (needsBlogPreview) renderBlogPreview(posts);
        if (needsBlogPage) renderBlogPage(posts);
      }
    } catch (error) {
      console.error(error);
      if (needsCjenik) renderCjenik(FALLBACK_CJENIK);
      if (needsEdu) renderEdukacije(FALLBACK_EDUKACIJE);
      const status = document.getElementById("blog-status");
      if (status) {
        status.hidden = false;
        status.textContent =
          "Sadržaj se trenutačno ne može učitati. Pokušaj ponovo malo kasnije.";
        status.classList.add("is-error");
      }
    }
  };

  boot();
})();
