import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import clickOutside from './directives/clickOutside';

Vue.config.productionTip = false;

Vue.directive('click-outside', clickOutside);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
