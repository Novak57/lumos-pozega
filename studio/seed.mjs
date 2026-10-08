/**
 * Jednokratno punjenje cjenika i edukacija.
 *
 * Preferirano (ulogiran Sanity CLI):
 *   npm run seed
 *
 * Alternativa (API token):
 *   $env:SANITY_TOKEN="write_token"
 *   node seed.mjs
 */

import sanityCli from "sanity/cli";
import { createClient } from "@sanity/client";

// Preferirano: npm run seed  (= sanity exec … --with-user-token)
// Alternativa: $env:SANITY_TOKEN="…" ; node seed.mjs
const client = process.env.SANITY_TOKEN
  ? createClient({
      projectId: "7b3vlfno",
      dataset: "production",
      apiVersion: "2025-01-01",
      token: process.env.SANITY_TOKEN,
      useCdn: false,
    })
  : sanityCli.getCliClient({ apiVersion: "2025-01-01" });

const key = () => Math.random().toString(36).slice(2, 10);

const cjenik = {
  _id: "cjenik",
  _type: "cjenik",
  stavke: [
    {
      _key: key(),
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
      _key: key(),
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
      _key: key(),
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
      _key: key(),
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
      _key: key(),
      kpd: "85.59.09",
      sifra: "",
      naziv: "Individualno pedagoško savjetovanje adolescenata",
      opis: "16+ · 60 minuta · uživo u Požegi ili online",
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

const edukacije = {
  _id: "edukacije",
  _type: "edukacije",
  stavke: [
    {
      _key: key(),
      godina: "2014.",
      tekst:
        "Početak edukacije iz realitetne terapije — Europski institut za realitetnu terapiju",
    },
    {
      _key: key(),
      godina: "2016.",
      tekst: "Magistra anglistike i pedagogije — Sveučilište u Zadru",
    },
    {
      _key: key(),
      godina: "2019.",
      tekst: "Početak rada s klijentima pod supervizijom",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst:
        "Psihoterapeut realitetne terapije — Europska udruga za realitetnu terapiju",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst:
        "Europski certifikat iz psihoterapije (ECP) — Europska udruga za psihoterapiju",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst:
        "Upis u Imenik psihoterapeuta Hrvatske komore psihoterapeuta (HKPT)",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst: "Vizualni dijalog: korištenje Dixit karti u savjetovanju — ZAMisli",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst: "Theraplay & MIM Level 1 — The Theraplay Institute",
    },
    {
      _key: key(),
      godina: "2025.",
      tekst: "Osnove trauma-focused KBT-a — GBF Educa",
    },
    {
      _key: key(),
      godina: "2026.",
      tekst: "EMDR Level 1 — EMDR Hrvatska",
    },
  ],
};

await client.createOrReplace(cjenik);
await client.createOrReplace(edukacije);

console.log("Učitani cjenik i edukacije u Sanity (production).");
console.log("Blog objava nema u seedu — dodaj ih u Studiju kad bude spremna.");
