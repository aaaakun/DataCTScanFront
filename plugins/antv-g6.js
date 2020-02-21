import Vue from 'vue'

if (process.client) {
  const G6 = require('@antv/g6');
  const G2 = require('@antv/g2');
	Vue.use(G6);
	Vue.use(G2);
}
