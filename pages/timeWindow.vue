<template>
  <div>
    <div class="datapicker">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="to"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <el-button @click="submitDataRange(dateRange)"> Submit </el-button>
    </div>
    <graph v-bind:graphData="graphData" />
  </div>
</template>
<script>
import Graph from '@/components/Graph'
import Vue from 'vue'
import { Component, Provide, Emit, Getter } from 'nuxt-property-decorator'
import gql from 'graphql-tag'
import queryGraphByTimeWindow from '~/apollo/queries/queryGraphByTimeWindow'

@Component({
  components: { Graph }
})
export default class TimeWindow extends Vue {
  @Getter realm

  @Provide()
  pickerOptions = {
    shortcuts: [
      {
        text: 'Last Week',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: 'Last Month',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: 'Last Quarter',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }

  @Provide()
  dateRange = []

  @Provide()
  graphData = {}

  @Emit()
  submitDataRange(dateRange) {
    this.$apollo
      .query({
        query: queryGraphByTimeWindow,
        variables: {
          startTime: this.dateRange[0],
          // 23:59:59 of endDate
          endTime: new Date(this.dateRange[1].getTime() + 86399999),
          realm: this.realm
        }
      })
      .then(({ data }) => {
        data.timeWindowGraph.nodes.forEach(node => {
          node.snapshotDate = new Date(node.snapshotDate)
          node.completeTime = new Date(node.completeTime)
        })
        this.graphData = data.timeWindowGraph
      })
  }
}
</script>

<style lang="scss" scoped>
.datapicker {
  margin-top: 35px;
  margin-left: 300px;
}
</style>
