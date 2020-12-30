import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Summary from '../views/Summary.vue';
import Company from '../views/Company.vue';
import Config from '../views/Config.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Summary',
    component: Summary,
  },
  {
    path: '/news',
    name: 'News',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/News.vue'),
  },
  {
    path: '/company',
    name: 'Company',
    component: Company,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
