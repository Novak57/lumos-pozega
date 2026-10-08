import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog zapis",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Naslov",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Tekst",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Naslov", value: "h3" },
          ],
          lists: [
            { title: "Točke", value: "bullet" },
            { title: "Brojevi", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Podebljano", value: "strong" },
              { title: "Kurziv", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    // Automatski pri kreiranju — ona ovo ne vidi / ne bira
    defineField({
      name: "publishedAt",
      title: "Datum objave",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Datum objave, novije",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
    },
    prepare({ title, date }) {
      return {
        title: title || "Bez naslova",
        subtitle: date
          ? new Date(date).toLocaleDateString("hr-HR")
          : "Nova objava",
      };
    },
  },
});
