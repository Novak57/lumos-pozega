import { defineField, defineType } from "sanity";

export const cjenik = defineType({
  name: "cjenik",
  title: "Cjenik",
  type: "document",
  fields: [
    defineField({
      name: "sidrenaDatum",
      title: "Datum sidrene cijene",
      type: "date",
      description:
        "Prikazuje se uz sidrenu cijenu na stranici (npr. 10. 9. 2026.).",
      options: { dateFormat: "DD.MM.YYYY" },
    }),
    defineField({
      name: "stavke",
      title: "Stavke cjenika",
      type: "array",
      of: [
        {
          type: "object",
          name: "stavka",
          fields: [
            defineField({
              name: "naziv",
              title: "Naziv usluge",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "opis",
              title: "Opis (ispod naziva)",
              type: "string",
            }),
            defineField({
              name: "cijena",
              title: "Cijena",
              type: "string",
              description:
                'Broj (npr. 50) ili tekst (npr. „na upit”). Znak € dodaje se samo ako je uključeno „U eurima”.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "uEurima",
              title: "U eurima",
              type: "boolean",
              description:
                "Uključeno: uz cijenu se prikazuje €. Isključeno za tekstualne cijene (npr. „na upit”).",
              initialValue: true,
            }),
            defineField({
              name: "sidrena",
              title: "Sidrena cijena",
              type: "string",
              description:
                "Opcionalno. Ostavi prazno ako nije potrebna (npr. kod „na upit”).",
            }),
            defineField({
              name: "kpd",
              title: "KPD oznaka",
              type: "string",
              initialValue: "86.93.00",
            }),
            // Ostala Excel polja — fiksirana, ne diraju se u CMS-u
            defineField({
              name: "sifra",
              title: "Interna šifra",
              type: "string",
              initialValue: "",
              hidden: true,
            }),
            defineField({
              name: "jedinica",
              title: "Jed. mjera",
              type: "string",
              initialValue: "sat",
              hidden: true,
            }),
            defineField({
              name: "kolicina",
              title: "Količina",
              type: "string",
              initialValue: "1",
              hidden: true,
            }),
            defineField({
              name: "popust",
              title: "Popust",
              type: "string",
              initialValue: "0",
              hidden: true,
            }),
            defineField({
              name: "porez",
              title: "Porez",
              type: "string",
              initialValue: "0",
              hidden: true,
            }),
          ],
          preview: {
            select: { title: "naziv", subtitle: "cijena", uEurima: "uEurima" },
            prepare({ title, subtitle, uEurima }) {
              const euro = uEurima !== false && subtitle ? " €" : "";
              return {
                title: title || "Stavka",
                subtitle: subtitle ? `${subtitle}${euro}` : "",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "napomene",
      title: "Napomene ispod cjenika",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Cjenik" };
    },
  },
});
