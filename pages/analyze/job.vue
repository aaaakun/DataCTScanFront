<template>
  <div class="job">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="Form">
        <el-form
          :rules="rules"
          ref="form"
          :model="form"
          label-width="200px"
          class="form"
        >
          <el-form-item label="namespace" prop="namespace">
            <el-input v-model="form.namespace"></el-input>
          </el-form-item>
          <el-form-item label="shortName" prop="shortName">
            <el-input v-model="form.shortName"></el-input>
          </el-form-item>
          <el-form-item label="dataRange">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="to"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryJobDelay">Submit</el-button>
            <el-button>Cancle</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <line-chart v-bind:chartData="chartData" class="chartData" />
  </div>
</template>

<script>
import LineChart from '@/components/LineChart'
import Vue from 'vue'
import {
  Component,
  Provide,
  Getter,
  Emit
} from 'nuxt-property-decorator'
import queryJobAndDependenciesDelay from '~/apollo/queries/queryJobAndDependenciesDelay'
import dateUtils from '~/utils/dateUtils'

@Component({
  components: { LineChart }
})
export default class Jobs extends Vue {
  @Getter realm

  @Provide()
  activeNames = ['1']

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

  @Provide()
  form = {
    namespace: '',
    shortName: ''
  }

  @Provide()
  rules = {
    namespace: [
      { required: true, message: 'Please input namespace', trigger: 'blur' }
    ],
    shortName: [
      { required: true, message: 'Please input shortName', trigger: 'blur' }
    ]
  }

  @Emit()
  queryJobDelay() {
    this.$apollo
      .query({
        query: queryJobAndDependenciesDelay,
        variables: {
          job: {
            namespace: this.form.namespace,
            shortName: this.form.shortName
          },
          startDate: dateUtils.formatDate(this.dateRange[0]),
          endDate: dateUtils.formatDate(this.dateRange[1]),
          realm: this.realm
        }
      })
      .then(({ data }) => {
        this.chartData = data.jobAndDependenciesDelay
        this.activeNames = []
      })
  }
}
</script>

<style lang="scss" scoped>
.chartData {
  margin-right: 100px;
}

.form {
  margin-left: 250px;
  margin-top: 50px;
  width: 500px;
}
</style>
