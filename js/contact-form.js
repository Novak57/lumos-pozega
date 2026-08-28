(() => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form || !status) return;

  const setStatus = (message, type) => {
    status.hidden = false;
    status.textContent = message;
    status.className = `contact-form__status contact-form__status--${type}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const accessKey = window.LumosContact?.accessKey?.trim();
    if (!accessKey) {
      setStatus(
        "Kontakt forma trenutno nije aktivna. Javite se putem Instagrama.",
        "error"
      );
      return;
    }

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    setStatus("Slanje…", "pending");

    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: data.name,
          email: data.email,
          message: data.message,
          subject: `Upit s weba · ${data.name}`.trim(),
          from_name: "Lumos Požega",
          botcheck: false,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        setStatus(
          "Poruka je poslana. Odgovorit ću vam u najkraćem mogućem roku.",
          "success"
        );
      } else {
        throw new Error(result.message || "Slanje nije uspjelo.");
      }
    } catch {
      setStatus(
        "Poruka nije poslana. Pokušajte ponovno ili me kontaktirajte putem Instagrama.",
        "error"
      );
    } finally {
      submit.disabled = false;
    }
  });
})();
