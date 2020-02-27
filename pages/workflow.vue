<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="Form">
        <el-form
          :model="form"
          status-icon
          :rules="rules"
          ref="form"
          label-width="100px"
          class="form"
        >
          <el-form-item label="namespace" prop="namespace">
            <el-input v-model="form.namespace"></el-input>
          </el-form-item>
          <el-form-item label="shortName" prop="shortName">
            <el-input v-model="form.shortName"></el-input>
          </el-form-item>
          <el-form-item label="version" prop="version">
            <el-select v-model.number="form.version">
              <el-option
                v-for="item in versions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >Submit</el-button
            >
            <el-button @click="resetForm('form')">Reset</el-button>
          </el-form-item>
        </el-form>
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
  namespace
} from 'nuxt-property-decorator'
import gql from 'graphql-tag'
import queryWorkflowVersions from '~/apollo/queries/queryWorkflowVersions'
import queryGraphByWorkflow from '~/apollo/queries/queryGraphByWorkflow'

@Component({
  components: { Graph },
  apollo: {
    versions: {
      query: queryWorkflowVersions,
      variables() {
        return {
          namespace: this.form.namespace,
          shortName: this.form.shortName,
          realm: this.realm
        }
      },
      update: data => data.workflowVersions,
      skip() {
        return !this.form.namespace || !this.form.shortName
      }
    }
  }
})
export default class Workflow extends Vue {
  @Getter realm

  @Provide()
  activeNames = ['1']

  @Provide()
  form = {
    namespace: '',
    shortName: '',
    version: ''
  }

  @Provide()
  rules = {
    namespace: [
      { required: true, message: 'Please input namespace', trigger: 'blur' }
    ],
    shortName: [
      { required: true, message: 'Please input shortName', trigger: 'blur' }
    ],
    version: [{ validator: this.versionValidator, trigger: 'blur' }]
  }

  @Provide()
  graphData = {}

  @Emit()
  submitForm(formName) {
    this.$refs[formName].validate(valid => {
      if (valid) {
        this.$apollo
          .query({
            query: queryGraphByWorkflow,
            variables: {
              namespace: this.form.namespace,
              shortName: this.form.shortName,
              version: this.form.version,
              realm: this.realm
            }
          })
          .then(({ data }) => {
            data.workflowGraph.nodes.forEach(node => {
              node.snapshotDate = new Date(node.snapshotDate)
              node.completeTime = new Date(node.completeTime)
            })
            this.graphData = data.workflowGraph
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  @Emit()
  resetForm(formName) {
    this.$refs[formName].resetFields()
  }

  @Emit()
  versionValidator(rule, value, callback) {
    if (!this.form || !this.form.version) {
      callback(new Error('Please input completeTime'))
    } else if (!this.versions || !this.versions.includes(this.form.version)) {
      callback(new Error('Invaild version'))
    } else {
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 35px;
  margin-left: 300px;
  width: 500px;
}
</style>
