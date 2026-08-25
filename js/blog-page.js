(() => {
  const nav = document.getElementById("blog-nav-list");
  const list = document.getElementById("articles-list");
  const status = document.getElementById("blog-status");

  if (!nav || !list || !window.LumosSanity) return;

  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    category,
    excerpt,
    publishedAt,
    body,
    "slug": slug.current
  }`;

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.hidden = !message;
    status.textContent = message || "";
    status.classList.toggle("is-error", isError);
  };

  const reveal = (el) => {
    el.classList.add("reveal", "is-visible");
  };

  const render = (posts) => {
    if (!posts.length) {
      nav.innerHTML = "";
      list.innerHTML = "";
      setStatus("Još nema objava.");
      return;
    }

    setStatus("");

    nav.innerHTML = posts
      .map(
        (post) => `
        <li>
          <a href="#${post.slug}">
            <span>${post.category || "Blog"}</span>
            ${post.title}
          </a>
        </li>`
      )
      .join("");

    list.innerHTML = posts
      .map((post, index) => {
        const prev = posts[index - 1];
        const next = posts[index + 1];
        const pager = next
          ? `<nav class="article__pager" aria-label="Sljedeći zapis">
              <a href="#${next.slug}">
                <span>Sljedeći zapis</span>
                ${next.title}
              </a>
            </nav>`
          : prev
            ? `<nav class="article__pager" aria-label="Prethodni zapis">
                <a class="article__pager--prev" href="#${prev.slug}">
                  <span>Prethodni zapis</span>
                  ${prev.title}
                </a>
              </nav>`
            : "";

        return `
          <article class="article reveal is-visible" id="${post.slug}">
            <p class="eyebrow">${post.category || "Blog"}</p>
            <h2>${post.title}</h2>
            <div class="article__body">
              ${window.portableTextToHtml(post.body)}
            </div>
            ${pager}
          </article>`;
      })
      .join("");

    reveal(nav.closest(".blog-nav") || nav);
    if (location.hash) {
      const target = document.querySelector(location.hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  window.LumosSanity.fetchQuery(query)
    .then(render)
    .catch((error) => {
      console.error(error);
      setStatus("Blog se trenutačno ne može učitati. Pokušaj ponovo malo kasnije.", true);
    });
})();
