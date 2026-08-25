/**
 * Jednokratno punjenje postojećih blog tekstova.
 *
 * 1. U Sanity Manage → API → Tokens napravi novi token s pravom Editor/Write
 * 2. U PowerShellu (u mapi studio):
 *    $env:SANITY_TOKEN="tvoj_novi_token"
 *    npm run seed
 * 3. Obriši token ako više ne trebaš write pristup
 *
 * NEMOJ koristiti token koji si već dijelio u chatu — regeneriraj ga.
 */

import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error("Nedostaje SANITY_TOKEN. Vidi komentar na vrhu seed.mjs.");
  process.exit(1);
}

const client = createClient({
  projectId: "7b3vlfno",
  dataset: "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const block = (text) => ({
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", text, marks: [] }],
});

const posts = [
  {
    _id: "post-odnos",
    _type: "post",
    title: "Partnerska terapija nije sudnica",
    slug: { _type: "slug", current: "odnos" },
    category: "O odnosima",
    excerpt:
      "Odnos nije 50–50. Svaki partner je 100% svoj odnos — sa svojim ponašanjima i uvjerenjima. Nesreća često dolazi iz čekanja da se drugi promijeni.",
    publishedAt: "2025-09-01T10:00:00.000Z",
    body: [
      block(
        "Odnos nije samo dvoje ljudi koji su u interakciji ili 50% ja, 50% ti. Moj odnos sam 100% ja sa svojim ponašanjima i uvjerenjima, kao što si ti 100% svoj odnos sa svojim ponašanjima i uvjerenjima."
      ),
      block(
        "To znači da sam ja odgovorna za ono što ja odabirem činiti kako bi se povezivala ili udaljavala od tebe. Svaki partner može kontrolirati samo svoje ponašanje pa onda, ako sam ja nesretna i želim da mi bude bolje, mogu raditi samo na svom ponašanju i napraviti nešto drugačije od onoga što sam do sada radila kako bih bila zadovoljnija."
      ),
      block(
        "Nesreća u odnosu proizlazi iz čekanja da se onaj drugi promijeni kako bi meni bilo bolje ili, još gore, inzistiranju na promjeni drugoga kritiziranjem, vrijeđanjem, pokušajem kontroliranja."
      ),
      block(
        "Partnerska terapija nije sudnica — u partnerskoj terapiji ne biram strane, ja sam na strani vašeg odnosa ako je to nešto u što oboje želite ulagati. Nisam tu da odlučim tko je u pravu jer vjerujem da ste oboje u pravu — svatko iz svog kuta gledanja. Međutim, želite li dokazati da ste u pravu (i kome?) ili želite biti dobro sami sa sobom i jedno s drugim?"
      ),
      block(
        "Na partnerskoj terapiji učimo preuzeti odgovornost za vlastito ponašanje, dajemo prostor da čujemo drugoga te učimo kako se povezivati uz razlike i probleme koje imamo. Uspješan odnos nije onaj bez frustracija, nego onaj u kojem partneri žele zajedno tražiti rješenja i spremni su u tome poći od sebe."
      ),
    ],
  },
  {
    _id: "post-svjetlo",
    _type: "post",
    title: "Zašto Lumos — svjetlo, ne savršenstvo",
    slug: { _type: "slug", current: "svjetlo" },
    category: "O terapiji",
    excerpt:
      "Terapija nije dokaz da si slomljen. To je izbor da pogledaš svoje ponašanje, svoje veze i svoju slobodu — i da ne radiš to sam.",
    publishedAt: "2025-09-10T10:00:00.000Z",
    body: [
      block(
        "Ime Lumos nosi jednostavnu namjeru: upaliti svjetlo tamo gdje je dosad bilo previše tišine. Ne da sve postane savršeno, nego da se vidi dovoljno da možemo birati."
      ),
      block(
        "Još uvijek postoji stigma oko psihoterapije i mentalnog zdravlja. Kao da tražiti podršku znači da nismo dovoljno jaki. U realitetnoj terapiji vjerujem suprotno: snaga je u tome da preuzmemo odgovornost za vlastitu sreću, a povezanost s drugim čovjekom — terapeutom, partnerom, prijateljem — temelj je zdravlja, ne znak slabosti."
      ),
      block(
        "Ako čekaš da nestane tjeskoba, da se drugi promijeni ili da „dođe pravi trenutak“, možeš dugo čekati. Možeš, umjesto toga, početi od onoga što je tvoje: ponašanja koje biraš danas. Tu sam ako želiš to raditi u odnosu, a ne sam."
      ),
    ],
  },
];

const docs = await Promise.all(
  posts.map((post) => client.createOrReplace(post))
);

console.log(`Učitano ${docs.length} zapisa u Sanity (production).`);
