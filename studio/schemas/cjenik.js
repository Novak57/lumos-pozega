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
            // Excel kolone — idu u download, ne na stranicu
            defineField({
              name: "kpd",
              title: "KPD oznaka",
              type: "string",
              initialValue: "86.93.00",
            }),
            defineField({
              name: "sifra",
              title: "Interna šifra",
              type: "string",
              initialValue: "",
            }),
            defineField({
              name: "jedinica",
              title: "Jed. mjera",
              type: "string",
              initialValue: "sat",
            }),
            defineField({
              name: "kolicina",
              title: "Količina",
              type: "string",
              initialValue: "1",
            }),
            defineField({
              name: "popust",
              title: "Popust",
              type: "string",
              initialValue: "0",
            }),
            defineField({
              name: "porez",
              title: "Porez",
              type: "string",
              initialValue: "0",
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
