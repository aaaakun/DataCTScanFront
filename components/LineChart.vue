<template>
  <div>
    <div id="chartContainer"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  Component,
  Getter,
  Provide,
  Emit,
  Prop,
  Watch
} from 'nuxt-property-decorator'
import NodeInfo from '@/components/NodeInfo'

@Component({
  components: { NodeInfo }
})
export default class LineChart extends Vue {

  @Provide()
  chart = null

  @Prop(Array)
  chartData

  @Watch('chartData')
  onChartDataChange(value) {
    if(this.chartData)
      this.chart.changeData(value)
  }

  mounted() {
    // Config chart engine in brower
    if (process.client) {
      this.chart = new G2.Chart({
        container: 'chartContainer',
        forceFit: true,
        height: 500
      })
      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      this.chart.axis('delayDays', {
        label: {
          formatter: val => {
            return val + 'Days'
          }
        }
      })
      this.chart
        .line()
        .position('snapshotDate*delayDays')
        .color('name')
        .shape('smooth')
      this.chart
        .point()
        .position('snapshotDate*delayDays')
        .color('name')
        .size(4)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1
        })
      this.chart.source(this.chartData, {
        snapshotDate: {
          range: [0, 1]
        }
      })
      this.chart.render()
    }
  }
}
</script>
