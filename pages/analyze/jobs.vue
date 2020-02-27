<template>
  <div class="jobs">
    <line-chart v-bind:chartData="chartData" />
  </div>
</template>

<script>
  import LineChart from '@/components/LineChart';
  import Vue from 'vue'
  import { Component, Provide, Getter } from 'nuxt-property-decorator'
  import queryAllJobsDelay from '~/apollo/queries/queryAllJobsDelay'

  @Component({
    components: { LineChart },
    apollo: {
      chartData: {
        query: queryAllJobsDelay,
        variables() {
          return { realm: this.realm }
        },
        update: data => data.allJobsDelay
      }
    }
  })
  export default class Jobs extends Vue {
    @Getter realm

    @Provide()
    aaa = [ { "snapshotDate": "2020-01-01", "delayDays": 148, "name": "namespace_shortName" }, { "snapshotDate": "2020-01-01", "delayDays": 149, "name": "namespace1_shortName1" } ]

  }
</script>
