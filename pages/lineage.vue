<template>
  <div>
    <el-row class="cascader">
      <el-col :span="8">
        <el-cascader-panel :options="options" @change="onTypeChange"></el-cascader-panel>
      </el-col>
      <el-col :span="10"  :offset="1" v-if="map[type]">
        <el-form :ref="map[type]['formName']" :model="map[type]['form']" label-width="90px">
          <el-form-item v-for="(value, key) in map[type]['form']" :key="key" :label="key">
            <el-input v-model="map[type]['form'][key]"></el-input>
          </el-form-item>
          <el-form-item label="snapshotDate">
            <el-date-picker
              v-model="map[type]['snapshotDate']"
              type="date"
              placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitForm(map[type]['form'])">Submit</el-button>
            <el-button>Cancle</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <graph v-bind:graphData="graphData" />
  </div>
</template>

<script>
import Graph from '@/components/Graph'
import Vue from 'vue'
import { Component, Provide, Emit } from 'nuxt-property-decorator'

@Component({
  components: { Graph }
})
export default class Lineage extends Vue {
  @Provide()
  type = ''

  @Provide()
  graphData = {}

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
  map = {
    Glue: {
      formName: 'GlueForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        database: '',
        table: ''
      },
      snapshotDate: ''
    },
    EDX: {
      formName: 'EDXForm',
      form: {
        provider: '',
        subject: '',
        dataset: ''
      },
      snapshotDate: ''
    },
    S3: {
      formName: 'S3Form',
      form: {
        s3Bucket: '',
        s3Prefix: ''
      },
      snapshotDate: ''
    },
    DDB: {
      formName: 'DDBForm',
      form: {
        AWSAccount: '',
        AWSRegion: '',
        table: ''
      },
      snapshotDate: ''
    },
    Job: {
      formName: 'JobForm',
      form: {
        namespace: '',
        shortName: ''
      },
      snapshotDate: ''
    }
  }

  @Emit()
  onSubmitForm(form) {
    console.log(form)
  }

  @Emit()
  onTypeChange(value) {
    this.type = value[value.length - 1]
    console.log(this.type)
  }
}
</script>


<style lang="scss" scoped>
.cascader {
  margin-top: 35px;
  margin-left: 35px;
}
</style>