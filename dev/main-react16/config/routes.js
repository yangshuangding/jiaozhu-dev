export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/react16',
              },
              {
                path: '/react16',
                name: 'react16',
                icon: 'StarOutlined',
                component: './react16/react16',
                exact: false,
              },
              {
                path: '/react17',
                name: 'react17',
                icon: 'TrademarkOutlined',
                component: './react17/react17',
                exact: false,
              },
              {
                path: '/vue2',
                name: 'vue2',
                icon: 'FireOutlined',
                component: './vue2/vue2',
                exact: false,
              },
              {
                path: '/vue3',
                name: 'vue3',
                icon: 'ThunderboltOutlined',
                component: './vue3/vue3',
                exact: false,
              },
              {
                path: '/vite2',
                name: 'vite2',
                icon: 'SendOutlined',
                component: './vite2/vite2',
                exact: false,
              },
              {
                path: '/vite4',
                name: 'vite4',
                icon: 'RocketOutlined',
                component: './vite4/vite4',
                exact: false,
              },
              {
                path: '/angular11',
                name: 'angular11',
                icon: 'HistoryOutlined',
                component: './angular11/angular11',
                exact: false,
              },
              {
                path: '/angular14',
                name: 'angular14',
                icon: 'HistoryOutlined',
                component: './angular14/angular14',
                exact: false,
              },
              {
                path: '/multiple',
                name: 'multiple',
                icon: 'HddOutlined',
                component: './multiple/multiple',
                exact: false,
              },
              {
                name: 'self',
                path: '/self',
                icon: 'CloudOutlined',
                component: './self',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
