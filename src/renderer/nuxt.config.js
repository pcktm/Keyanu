/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  ssr: false,
  components: true,
  head: {
    title: 'bite2020',
    meta: [{ charset: "utf-8" }],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap'
      },
      {rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.0.5/css/boxicons.min.css'},
    ]
  },
  loading: false,
  plugins: [
    {src: '~/plugins/vuex-persist', ssr: false}
  ],
  buildModules: [
    
  ],
  modules: [
    
  ],
};
