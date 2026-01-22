
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/plantilla-cierre-2.0/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/plantilla-cierre-2.0/formulario",
    "route": "/plantilla-cierre-2.0"
  },
  {
    "renderMode": 2,
    "route": "/plantilla-cierre-2.0/formulario"
  },
  {
    "renderMode": 2,
    "route": "/plantilla-cierre-2.0/historial"
  },
  {
    "renderMode": 2,
    "redirectTo": "/plantilla-cierre-2.0/formulario",
    "route": "/plantilla-cierre-2.0/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 756, hash: '189cbef7c5b9e3e07344c4ec854370552d9a1332857ac78f99e4156129c43142', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 976, hash: 'f1b697e259bf9464d5d9e945f9c38a1f54fee159373d87bc975e07afb5cd47e2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'historial/index.html': {size: 18402, hash: 'f719b77df235689c5614c689629417de213fa7b8f0655b3926d1c30a4ba5e839', text: () => import('./assets-chunks/historial_index_html.mjs').then(m => m.default)},
    'formulario/index.html': {size: 35645, hash: '817cf5960c07c2e2b58aa92fcd01eb5193bbf39ccd7710ef4c0d3fceebeda166', text: () => import('./assets-chunks/formulario_index_html.mjs').then(m => m.default)},
    'styles-NRLRE5AK.css': {size: 543, hash: 'Hpq3ikoadBE', text: () => import('./assets-chunks/styles-NRLRE5AK_css.mjs').then(m => m.default)}
  },
};
