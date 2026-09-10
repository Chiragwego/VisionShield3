import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "VisionShield",
    description:
      "Privacy-first on-device visual perception for lightweight browser agents.",
    version: "0.1.0",
    permissions: [
      "storage",
      "activeTab"
    ],
    host_permissions: ["<all_urls>"],
  },
});
