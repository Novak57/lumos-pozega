import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "lumos-pozega",
  title: "Lumos Požega",
  projectId: "7b3vlfno",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Sadržaj")
          .items([
            S.listItem()
              .title("Cjenik")
              .id("cjenik")
              .child(
                S.document().schemaType("cjenik").documentId("cjenik").title("Cjenik")
              ),
            S.listItem()
              .title("Edukacije")
              .id("edukacije")
              .child(
                S.document()
                  .schemaType("edukacije")
                  .documentId("edukacije")
                  .title("Edukacije")
              ),
            S.documentTypeListItem("post").title("Blog"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
