import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  alias: {
    "@": resolve(__dirname, "/"),
  },
  app: {
    head: {
      title: 'Mini CloudHunt 1.0',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
});
