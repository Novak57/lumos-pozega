(() => {
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const renderChildren = (children = []) =>
    children
      .map((child) => {
        let text = escapeHtml(child.text || "");
        if (!text) return "";
        if (child.marks?.includes("strong")) text = `<strong>${text}</strong>`;
        if (child.marks?.includes("em")) text = `<em>${text}</em>`;
        const linkMark = child.marks?.find((mark) =>
          (child.markDefs || []).some((def) => def._key === mark && def._type === "link")
        );
        // markDefs live on the block, not the child — handled below via block context
        return text;
      })
      .join("");

  const renderSpan = (child, markDefs = []) => {
    let text = escapeHtml(child.text || "");
    if (!text) return "";

    const marks = child.marks || [];
    if (marks.includes("code")) text = `<code>${text}</code>`;
    if (marks.includes("strong")) text = `<strong>${text}</strong>`;
    if (marks.includes("em")) text = `<em>${text}</em>`;

    marks.forEach((mark) => {
      const def = markDefs.find((item) => item._key === mark);
      if (def?._type === "link" && def.href) {
        const href = escapeHtml(def.href);
        text = `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
      }
    });

    return text;
  };

  const renderBlock = (block) => {
    const markDefs = block.markDefs || [];
    const inner = (block.children || []).map((child) => renderSpan(child, markDefs)).join("");

    if (block.listItem === "bullet") return `<li>${inner}</li>`;
    if (block.listItem === "number") return `<li>${inner}</li>`;

    switch (block.style) {
      case "h3":
        return `<h3>${inner}</h3>`;
      case "blockquote":
        return `<blockquote>${inner}</blockquote>`;
      default:
        return `<p>${inner}</p>`;
    }
  };

  window.portableTextToHtml = (blocks = []) => {
    if (!Array.isArray(blocks) || !blocks.length) return "";

    let html = "";
    let listType = null;

    const closeList = () => {
      if (listType === "bullet") html += "</ul>";
      if (listType === "number") html += "</ol>";
      listType = null;
    };

    blocks.forEach((block) => {
      if (block._type !== "block") return;

      if (block.listItem) {
        const nextType = block.listItem === "number" ? "number" : "bullet";
        if (listType !== nextType) {
          closeList();
          html += nextType === "number" ? "<ol>" : "<ul>";
          listType = nextType;
        }
        html += renderBlock(block);
        return;
      }

      closeList();
      html += renderBlock(block);
    });

    closeList();
    return html;
  };

  // silence unused helper in case of older caches
  void renderChildren;
})();
