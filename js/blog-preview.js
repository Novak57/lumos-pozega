(() => {
  const root = document.getElementById("blog-preview");
  if (!root || !window.LumosSanity) return;

  const query = `*[_type == "post"] | order(publishedAt desc)[0...2] {
    title,
    category,
    excerpt,
    "slug": slug.current
  }`;

  window.LumosSanity.fetchQuery(query)
    .then((posts) => {
      if (!posts?.length) {
        root.innerHTML = `
          <p class="blog-empty reveal is-visible">
            Novi zapisi uskoro.
          </p>`;
        return;
      }

      root.innerHTML = posts
        .map(
          (post) => `
          <a class="post reveal is-visible" href="blog.html#${post.slug}">
            <p class="post__date">${post.category || "Blog"}</p>
            <h3>${post.title}</h3>
            <p>${post.excerpt || ""}</p>
            <span class="textlink">Pročitaj na blogu</span>
          </a>`
        )
        .join("");
    })
    .catch((error) => {
      console.error(error);
      root.innerHTML = `
        <p class="blog-empty reveal is-visible">
          Pregled bloga trenutačno nije dostupan.
        </p>`;
    });
})();
