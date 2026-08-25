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
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      description: 'Npr. "O odnosima" ili "O terapiji"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Kratki uvod",
      type: "text",
      rows: 3,
      description: "Prikazuje se na početnoj stranici i u pregledu.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "publishedAt",
      title: "Datum objave",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
                      rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
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
      subtitle: "category",
      date: "publishedAt",
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: date
          ? `${subtitle || ""} · ${new Date(date).toLocaleDateString("hr-HR")}`
          : subtitle,
      };
    },
  },
});
