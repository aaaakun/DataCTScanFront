<template>
  <div class="jobs">
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
    <line-chart v-bind:chartData="chartData" class="chartData"/>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart'
import Vue from 'vue'
import { Component, Provide, Getter, Emit } from 'nuxt-property-decorator'
import queryAllJobsDelay from '~/apollo/queries/queryAllJobsDelay'
import dateUtils from '~/utils/dateUtils'

@Component({
  components: { LineChart },
})
export default class Jobs extends Vue {
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
  chartData = []

  @Provide()
  dateRange = []

  @Emit()
  submitDataRange(dateRange) {
    this.$apollo
      .query({
        query: queryAllJobsDelay,
        variables: {
          startDate: dateUtils.formatDate(this.dateRange[0]),
          endDate: dateUtils.formatDate(this.dateRange[1]),
          realm: this.realm
        }
      })
      .then(({ data }) => {
        this.chartData = data.allJobsDelay
      })
  }
}
</script>

<style lang="scss" scoped>
.datapicker {
  margin-top: 35px;
  margin-left: 500px;
}

.chartData {
  margin-right: 100px;
}
</style>
