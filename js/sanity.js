window.LumosSanity = {
  enabled: true,
  projectId: "7b3vlfno",
  dataset: "production",
  apiVersion: "2025-01-01",
};

window.LumosSanity.queryUrl = function queryUrl(groq) {
  // api. (ne apicdn.) — bez CDN keša, da CMS promjene odmah budu na stranici
  const base = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`;
  return `${base}?query=${encodeURIComponent(groq)}`;
};

window.LumosSanity.fetchQuery = async function fetchQuery(groq) {
  if (!this.enabled) {
    throw new Error("Sanity je isključen.");
  }

  if (location.protocol === "file:") {
    throw new Error(
      "FILE_PROTOCOL: Stranicu treba otvoriti preko lokalnog servera ili GitHub Pages, ne dvostrukim klikom na HTML."
    );
  }

  const response = await fetch(this.queryUrl(groq));
  if (!response.ok) {
    throw new Error(`Sanity greška (${response.status})`);
  }
  const data = await response.json();
  return data.result;
};
