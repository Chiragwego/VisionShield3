export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("VisionShield content script started");
  },
});
