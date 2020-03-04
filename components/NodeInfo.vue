<template>
  <div>
    <div>id: {{ node.id }}</div>
    <div>Snapshot Date: {{ node.snapshotDate.toLocaleDateString() }}</div>
    <div>Complete Time: {{ node.completeTime }}</div>
    <div>teamName: {{ node.teamName }}</div>
    <div v-if="node.storage">
      <div v-for="(value, key) in node.storage" :key="key">
        {{ key === '__typename' ? 'Type' : key }}: {{ value }}
      </div>
    </div>
    <el-button @click="seachLineage">Search Lineage</el-button>
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
  Watch,
  Action,
  namespace
} from 'nuxt-property-decorator'
import dateUtils from '~/utils/dateUtils'
const Lineage = namespace('lineage')

@Component()
export default class Graph extends Vue {
  @Lineage.Action setGlueForm
  @Lineage.Action setEDXForm
  @Lineage.Action setDDBForm
  @Lineage.Action setS3Form
  @Lineage.Action setJobForm
  @Lineage.Action resetForms
  @Lineage.Action setType

  @Prop(Object)
  node

  @Emit()
  seachLineage() {
    this.resetForms()
    switch (this.node.storage.__typename) {
      case 'DDB': {
        this.setDDBForm({
          AWSAccount: this.node.storage.AWSAccount,
          AWSRegion: this.node.storage.AWSRegion,
          table: this.node.storage.table,
          snapshotDate: this.node.snapshotDate,
          completeTime: this.node.completeTime.toISOString()
        })
        this.setType('ddb')
        break;
      }

      case 'Glue': {
        this.setGlueForm({
          AWSAccount: this.node.storage.AWSAccount,
          AWSRegion: this.node.storage.AWSRegion,
          database: this.node.storage.database,
          table: this.node.storage.table,
          snapshotDate: this.node.snapshotDate,
          completeTime: this.node.completeTime.toISOString()
        })
        this.setType('glue')
        break;
      }

      case 'S3': {
        this.setS3Form({
          s3Bucket: this.node.storage.s3Bucket,
          s3Prefix: this.node.storage.s3Prefix,
          snapshotDate: this.node.snapshotDate,
          completeTime: this.node.completeTime.toISOString()
        })
        this.setType('s3')
        break;
      }

      case 'EDX': {
        this.setEDXForm({
          provider: this.node.storage.provider,
          subject: this.node.storage.subject,
          dataset: this.node.storage.dataset,
          snapshotDate: this.node.snapshotDate,
          completeTime: this.node.completeTime.toISOString()
        })
        this.setType('edx')
        break;
      }

      case 'JobRef': {
        this.setJobForm({
          namespace: this.node.storage.namespace,
          shortName: this.node.storage.shortName,
          snapshotDate: this.node.snapshotDate,
          completeTime: this.node.completeTime.toISOString()
        })
        this.setType('job')
        break;
      }
    }
    this.$router.push('/lineage')
  }
}
</script>
