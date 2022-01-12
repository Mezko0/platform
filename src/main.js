// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import DefaultLayout from '~/layouts/Default.vue';
import WebdocPageLayout from '~/layouts/WebdocPage.vue';

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);
  Vue.component('WebdocPageLayout', WebdocPageLayout);

  router.beforeEach((to, _from, next) => {
    // TODO: MOST of og:url links are broken atm
    head.htmlAttrs = { lang: 'uk-UA' };
    if (to.path !== '/404/') {
      head.meta.push({
        key: 'og:url',
        name: 'og:url',
        content: process.env.GRIDSOME_BASE_PATH + to.path,
      });
    }
    next();
  });
}
