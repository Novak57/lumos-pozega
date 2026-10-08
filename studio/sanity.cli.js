import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "7b3vlfno",
    dataset: "production",
  },
  // Live Studio: https://lumos-pozega.sanity.studio
  studioHost: "lumos-pozega",
});
