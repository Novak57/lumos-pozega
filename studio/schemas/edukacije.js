import { defineField, defineType } from "sanity";

export const edukacije = defineType({
  name: "edukacije",
  title: "Edukacije",
  type: "document",
  fields: [
    defineField({
      name: "stavke",
      title: "Stavke",
      type: "array",
      of: [
        {
          type: "object",
          name: "stavka",
          fields: [
            defineField({
              name: "godina",
              title: "Godina",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tekst",
              title: "Opis",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "tekst", subtitle: "godina" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Edukacije" };
    },
  },
});
