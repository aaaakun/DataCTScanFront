<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="Form">
        <el-row class="cascader" v-loading="loading">
          <el-col :span="8">
            <el-cascader-panel
              :options="options"
              @change="onTypeChange"
            ></el-cascader-panel>
          </el-col>
          <el-col :span="10" :offset="1" v-if="typeProperties[type]">
            <el-form
              :rules="typeProperties[type]['rules']"
              :ref="typeProperties[type]['formName']"
              :model="typeProperties[type]['form']"
              label-width="120px"
            >
              <el-form-item
                v-for="(value, key) in typeProperties[type]['form']"
                :key="key"
                :label="key"
                :prop="key"
              >
                <el-input
                  v-model="typeProperties[type]['form'][key]"
                ></el-input>
              </el-form-item>
              <el-form-item label="snapshotDate" prop="snapshotDate">
                <el-date-picker
                  v-model="typeProperties[type]['snapshotDate']"
                  type="date"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                label="completeTimes"
                prop="completeTime"
              >
                <el-select
                  v-model="typeProperties[type]['completeTime']"
                >
                  <el-option
                    v-for="item in completeTimes"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="queryLineage(typeProperties[type]['completeTime'])"
                  >Submit</el-button
                >
                <el-button>Cancle</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <graph v-bind:graphData="graphData" />
  </div>
</template>

<script>
import Graph from '@/components/Graph'
import Vue from 'vue'
import { Component, Provide, Emit, Getter } from 'nuxt-property-decorator'
import gql from 'graphql-tag'
import queryCompleteTimes from '~/apollo/queries/queryCompleteTimes'
import queryLineage from '~/apollo/queries/queryLineage'
import dateUtils from '~/utils/dateUtils'

@Component({
  components: { Graph },
  apollo: {
    completeTimes: {
      query: queryCompleteTimes,
      variables() {
        return this.variables
      },
      update: data => data.completeTimes,
      skip() {
        return !this.type || !this.variables
      },
      deep: true
    }
  }
})
export default class Lineage extends Vue {
  @Getter realm

  @Provide()
  activeNames = ['1']

  @Provide()
  type = ''

  @Provide()
  loading = false

  @Provide()
  graphData = {}

  @Provide()
  completeTime = ''

  @Provide()
  options = [
    {
      value: 'Data',
      label: 'Data',
      children: [
        {
          value: 'EDX',
          label: 'EDX'
        },
        {
          value: 'Glue',
          label: 'Glue'
        },
        {
          value: 'DDB',
          label: 'DDB'
        },
        {
          value: 'S3',
          label: 'S3'
        }
      ]
    },
    {
      value: 'Job',
      label: 'Job'
    }
  ]

  @Provide()
  typeProperties = {
    Glue: {
      formName: 'GlueForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        database: '',
        table: ''
      },
      rules: {
        AWSAccount: [
          {
            required: true,
            message: 'Please input AWSAccount',
            trigger: 'blur'
          }
        ],
        AWSRegion: [
          { required: true, message: 'Please input AWSRegion', trigger: 'blur' }
        ],
        database: [
          { required: true, message: 'Please input database', trigger: 'blur' }
        ],
        table: [
          { required: true, message: 'Please input table', trigger: 'blur' }
        ],
        snapshotDate: [
          { validator: this.snapshotDateValidator, trigger: 'blur' }
        ],
        completeTime: [
          { validator: this.completeTimeValidator, trigger: 'blur' }
        ]
      },
      snapshotDate: '',
      completeTime: ''
    },
    EDX: {
      formName: 'EDXForm',
      form: {
        provider: '',
        subject: '',
        dataset: ''
      },
      rules: {
        provider: [
          { required: true, message: 'Please input provider', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: 'Please input subject', trigger: 'blur' }
        ],
        dataset: [
          { required: true, message: 'Please input dataset', trigger: 'blur' }
        ],
        snapshotDate: [
          { validator: this.snapshotDateValidator, trigger: 'blur' }
        ],
        completeTime: [
          { validator: this.completeTimeValidator, trigger: 'blur' }
        ]
      },
      snapshotDate: '',
      completeTime: ''
    },
    S3: {
      formName: 'S3Form',
      form: {
        s3Bucket: '',
        s3Prefix: ''
      },
      rules: {
        s3Bucket: [
          { required: true, message: 'Please input s3Bucket', trigger: 'blur' }
        ],
        s3Prefix: [
          { required: true, message: 'Please input s3Prefix', trigger: 'blur' }
        ],
        snapshotDate: [
          { validator: this.snapshotDateValidator, trigger: 'blur' }
        ],
        completeTime: [
          { validator: this.completeTimeValidator, trigger: 'blur' }
        ]
      },
      snapshotDate: '',
      completeTime: ''
    },
    DDB: {
      formName: 'DDBForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        table: ''
      },
      rules: {
        AWSAccount: [
          {
            required: true,
            message: 'Please input AWSAccount',
            trigger: 'blur'
          }
        ],
        AWSRegion: [
          { required: true, message: 'Please input AWSRegion', trigger: 'blur' }
        ],
        table: [
          { required: true, message: 'Please input table', trigger: 'blur' }
        ],
        snapshotDate: [
          { validator: this.snapshotDateValidator, trigger: 'blur' }
        ],
        completeTime: [
          { validator: this.completeTimeValidator, trigger: 'blur' }
        ]
      },
      snapshotDate: '',
      completeTime: ''
    },
    Job: {
      formName: 'JobForm',
      form: {
        namespace: '',
        shortName: ''
      },
      rules: {
        namespace: [
          { required: true, message: 'Please input namespace', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: 'Please input shortName', trigger: 'blur' }
        ],
        snapshotDate: [
          { validator: this.snapshotDateValidator, trigger: 'blur' }
        ],
        completeTime: [
          { validator: this.completeTimeValidator, trigger: 'blur' }
        ]
      },
      snapshotDate: '',
      completeTime: ''
    }
  }

  get variables() {
    if (this.type && this.typeProperties[this.type]['snapshotDate']) {
      const result = {
        realm: this.realm,
        snapshotDate: dateUtils.formatDate(
          this.typeProperties[this.type]['snapshotDate']
        )
      }
      switch (this.type) {
        case 'DDB':
          result.ddb = this.typeProperties.DDB.form
          break
        case 'Glue':
          result.glue = this.typeProperties.Glue.form
          break
        case 'S3':
          result.s3 = this.typeProperties.S3.form
          break
        case 'EDX':
          result.edx = this.typeProperties.EDX.form
          break
        case 'Job':
          result.job = this.typeProperties.Job.form
          break
      }
      return result
    }
    return undefined
  }

  @Emit()
  queryLineage() {
    this.$refs[this.typeProperties[this.type]['formName']].validate(valid => {
      if (valid) {
        this.$apollo
          .query({
            query: queryLineage,
            variables: Object.assign(this.variables, {
              completeTime: this.typeProperties[this.type]['completeTime']
            })
          })
          .then(({ data }) => {
            data.lineage.nodes.forEach(node => {
              node.snapshotDate = new Date(node.snapshotDate)
              node.completeTime = new Date(node.completeTime)
            })
            this.graphData = data.lineage
            this.activeNames = []
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  @Emit()
  snapshotDateValidator(rule, value, callback) {
    if (!this.type || this.typeProperties[this.type]['snapshotDate'] === '') {
      callback(new Error('Please input snapshotDate'))
    } else {
      callback()
    }
  }

  @Emit()
  completeTimeValidator(rule, value, callback) {
    if (!this.type || !this.typeProperties[this.type]['completeTime']) {
      callback(new Error('Please input completeTime'))
    } else if (
      !this.completeTimes ||
      this.completeTimes.length === 0 ||
      !this.completeTimes.includes(
        this.typeProperties[this.type]['completeTime']
      )
    ) {
      callback(new Error('Invaild completeTime'))
    } else {
      callback()
    }
  }

  @Emit()
  onTypeChange(value) {
    this.type = value[value.length - 1]
  }
}
</script>

<style lang="scss" scoped>
.cascader {
  margin-top: 35px;
  margin-left: 35px;
}
</style>
