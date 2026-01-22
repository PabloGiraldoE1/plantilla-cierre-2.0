
export default {
  basePath: '/plantilla-cierre-2.0',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
