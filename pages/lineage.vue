<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="Form">
        <el-row class="cascader" v-loading="loading">
          <el-col :span="8">
            <el-cascader-panel
              :value='panelValue'
              :options="options"
              @change="onTypeChange"
            ></el-cascader-panel>
          </el-col>
          <el-col :span="10" :offset="1" v-if="typeProperties[type]">
            <el-form
              :rules="typeProperties[type]['rules']"
              :ref="typeProperties[type]['formName']"
              :model="typeProperties[type]['form']"
              label-width="200px"
            >
              <el-form-item
                v-for="(value, key) in typeProperties[type]['form']"
                :key="key"
                :label="key"
                :prop="key"
              >
                <el-date-picker
                  v-if="key === 'snapshotDate'"
                  v-model="typeProperties[type]['form'][key]"
                  type="date"
                >
                </el-date-picker>
                <el-select
                  v-else-if="key === 'completeTime'"
                  v-model="typeProperties[type]['form'][key]"
                >
                  <el-option
                    v-for="item in completeTimes"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="typeProperties[type]['form'][key]"
                ></el-input>
              </el-form-item>
              <el-form-item label="Show Successors:">
                <el-switch
                  v-model="showSuccessors"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
              <el-form-item label="Show Predecessors:">
                <el-switch
                  v-model="showPredecessors"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
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
import {
  Component,
  Provide,
  Emit,
  Getter,
  Action,
  namespace
} from 'nuxt-property-decorator'
import gql from 'graphql-tag'
import queryCompleteTimes from '~/apollo/queries/queryCompleteTimes'
import queryLineage from '~/apollo/queries/queryLineage'
import dateUtils from '~/utils/dateUtils'
const LineageVuex = namespace('lineage')

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
  @LineageVuex.Getter ddbForm
  @LineageVuex.Getter s3Form
  @LineageVuex.Getter glueForm
  @LineageVuex.Getter edxForm
  @LineageVuex.Getter jobForm
  @LineageVuex.Getter type
  @LineageVuex.Action setType
  @Getter realm

  @Provide()
  showSuccessors = false

  @Provide()
  showPredecessors = false

  @Provide()
  activeNames = ['1']

  @Provide()
  loading = false

  @Provide()
  graphData = {}

  @Provide()
  completeTime = ''

  @Provide()
  options = [
    {
      value: 'data',
      label: 'Data',
      children: [
        {
          value: 'edx',
          label: 'EDX'
        },
        {
          value: 'glue',
          label: 'Glue'
        },
        {
          value: 'ddb',
          label: 'DDB'
        },
        {
          value: 's3',
          label: 'S3'
        }
      ]
    },
    {
      value: 'job',
      label: 'Job'
    }
  ]

  @Provide()
  typeProperties = {
    glue: {
      formName: 'glueForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        database: '',
        table: '',
        snapshotDate: '',
        completeTime: ''
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
      }
    },
    edx: {
      formName: 'edxForm',
      form: {
        provider: '',
        subject: '',
        dataset: '',
        snapshotDate: '',
        completeTime: ''
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
      }
    },
    s3: {
      formName: 's3Form',
      form: {
        s3Bucket: '',
        s3Prefix: '',
        snapshotDate: '',
        completeTime: ''
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
      }
    },
    ddb: {
      formName: 'ddbForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        table: '',
        snapshotDate: '',
        completeTime: ''
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
      }
    },
    job: {
      formName: 'jobForm',
      form: {
        namespace: '',
        shortName: '',
        snapshotDate: '',
        completeTime: ''
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
      }
    }
  }

  get variables() {
    if (this.type) {
      for(let key in this.typeProperties[this.type].form) {
        if(key !== 'completeTime' && !this.typeProperties[this.type].form[key]) return undefined;
      }
      const result = {
        realm: this.realm,
        snapshotDate: dateUtils.formatDate(
          this.typeProperties[this.type].form['snapshotDate']
        )
      }
      result[this.type] = {}
      for(let key in this.typeProperties[this.type].form) {
        if(key !== 'completeTime' && key !== 'snapshotDate') {
          result[this.type][key] = this.typeProperties[this.type].form[key]
        }
      }
      return result
    }
    return undefined
  }

  get panelValue() {

    switch(this.type) {
      case 's3':
      case 'edx':
      case 'glue':
      case 'ddb': 
      return ['data', this.type];
      default: return [this.type]
    }

  }

  @Emit()
  queryLineage() {
    this.$refs[this.typeProperties[this.type]['formName']].validate(valid => {
      if (valid) {
        this.$apollo
          .query({
            query: queryLineage,
            variables: Object.assign(this.variables, {
              completeTime: this.typeProperties[this.type].form['completeTime'],
              showSuccessors: this.showSuccessors,
              showPredecessors: this.showPredecessors
            })
          })
          .then(({ data }) => {
            dateUtils.parseDateForGraphNode(data.lineage.nodes)
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
    if (!this.type || this.typeProperties[this.type].form['snapshotDate'] === '') {
      callback(new Error('Please input snapshotDate'))
    } else {
      callback()
    }
  }

  @Emit()
  completeTimeValidator(rule, value, callback) {
    if (!this.type || !this.typeProperties[this.type].form['completeTime']) {
      callback(new Error('Please input completeTime'))
    } else if (
      !this.completeTimes ||
      this.completeTimes.length === 0 ||
      !this.completeTimes.includes(
        this.typeProperties[this.type].form['completeTime']
      )
    ) {
      callback(new Error('Invaild completeTime'))
    } else {
      callback()
    }
  }

  @Emit()
  onTypeChange(value) {
    this.setType(value[value.length - 1])
  }

  mounted() {
    const formMap = new Map()
    formMap.set(this.typeProperties.ddb.form, this.ddbForm);
    formMap.set(this.typeProperties.glue.form, this.glueForm);
    formMap.set(this.typeProperties.edx.form, this.edxForm);
    formMap.set(this.typeProperties.s3.form, this.s3Form);
    formMap.set(this.typeProperties.job.form, this.jobForm);
    for(let type in this.typeProperties) {
      for(let key in this.typeProperties[type].form) {
        this.typeProperties[type].form[key] = formMap.get(this.typeProperties[type].form)[key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cascader {
  margin-top: 35px;
  margin-left: 35px;
}
</style>
