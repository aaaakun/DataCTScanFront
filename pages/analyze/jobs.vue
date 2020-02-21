<template>
  <div class="jobs">
    <line-chart />
  </div>
</template>

<script>
  import LineChart from '@/components/LineChart';
  import Vue from 'vue'
  import { Component, Provide } from 'nuxt-property-decorator'

  @Component({
    components: { LineChart }
  })
  export default class Jobs extends Vue {

  }
</script>