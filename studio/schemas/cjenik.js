import { defineField, defineType } from "sanity";

export const cjenik = defineType({
  name: "cjenik",
  title: "Cjenik",
  type: "document",
  fields: [
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
              title: "Cijena (€)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "sidrena",
              title: "Sidrena cijena (€)",
              type: "string",
              validation: (rule) => rule.required(),
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
            select: { title: "naziv", subtitle: "cijena" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Stavka",
                subtitle: subtitle ? `${subtitle} €` : "",
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
