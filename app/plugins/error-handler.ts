export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:error", (error, _instance, info) => {
    console.error("[Vue Error]", { error, info });
  });

  nuxtApp.hook("app:error", (error) => {
    console.error("[App Error]", error);
  });
});
