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
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button @click="submitDataRange(dateRange)"> Submit </el-button>
    </div>
    <graph v-bind:graphData="graphData"/>
  </div>
</template>
<script>
  import Graph from '@/components/Graph';
  import Vue from 'vue'
  import { Component, Provide, Emit } from 'nuxt-property-decorator'

  @Component({
    components: { Graph }
  })
  export default class TimeWindow extends Vue {

    @Provide()
    pickerOptions = 
    {
      shortcuts: [{
        text: 'Last Week',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: 'Last Month',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: 'Last Quarter',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
      }]
    };

    @Provide()
    dateRange = [];

    @Provide()
    graphData = {};
    
    @Emit()
    submitDataRange(dateRange) {
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      const response = {
        "data": {
            "timeWindowGraph": {
                "nodes": [
                    {
                        "id": "JobDefinition:USAmazon_namespace_shortName",
                        "name": "namespace_shortName",
                        "teamName": "teamA",
                        "snapshotDate": "2020-01-01",
                        "completeTime": "2020-01-28T11:26:39.359Z",
                        "storage": {
                            "__typename": "JobRef",
                            "codeRef": "CodeRef"
                        }
                    },
                    {
                        "id": "arn:aws:glue:us_east_1:234234124:table/database/table",
                        "name": "Glue:234234124.database.table",
                        "teamName": "teamB",
                        "snapshotDate": "2020-01-01",
                        "completeTime": "2020-01-28T10:26:39.359Z",
                        "storage": {
                            "__typename": "Glue",
                            "AWSAccount": "234234124",
                            "AWSRegion": "us_east_1",
                            "database": "database",
                            "table": "table"
                        }
                    },
                    {
                        "id": "arn:aws:dynamodb:us_east_1:234234124:table/table",
                        "name": "DDB:234234124.table",
                        "teamName": "teamA",
                        "snapshotDate": "2020-01-01",
                        "completeTime": "2020-01-28T10:26:39.359Z",
                        "storage": {
                            "__typename": "DDB",
                            "AWSAccount": "234234124",
                            "AWSRegion": "us_east_1",
                            "table": "table"
                        }
                    },
                    {
                        "id": "arn:aws:s3:::s3Bucket/s3Prefix",
                        "name": "S3:s3Bucket.s3Prefix",
                        "teamName": "teamB",
                        "snapshotDate": "2020-01-01",
                        "completeTime": "2020-01-28T10:26:39.359Z",
                        "storage": {
                            "__typename": "S3",
                            "s3Bucket": "s3Bucket",
                            "s3Prefix": "s3Prefix"
                        }
                    },
                    {
                        "id": "arn:amazon:edx:iad::manifest/provider/subject/dataset",
                        "name": "EDX:provider.subject.dataset",
                        "teamName": "teamC",
                        "snapshotDate": "2020-01-01",
                        "completeTime": "2020-01-28T10:26:39.359Z",
                        "storage": {
                            "__typename": "EDX",
                            "provider": "provider",
                            "subject": "subject",
                            "dataset": "dataset"
                        }
                    }
                ],
                "edges": [
                    {
                        "target": "arn:aws:glue:us_east_1:234234124:table/database/table",
                        "source": "JobDefinition:USAmazon_namespace_shortName"
                    },
                    {
                        "target": "arn:aws:dynamodb:us_east_1:234234124:table/table",
                        "source": "JobDefinition:USAmazon_namespace_shortName"
                    },
                    {
                        "target": "JobDefinition:USAmazon_namespace_shortName",
                        "source": "arn:aws:s3:::s3Bucket/s3Prefix"
                    },
                    {
                        "target": "JobDefinition:USAmazon_namespace_shortName",
                        "source": "arn:amazon:edx:iad::manifest/provider/subject/dataset"
                    }
                ]
            }
        }
      }
      response.data.timeWindowGraph.nodes.forEach(node => {
        node.snapshotDate = new Date(node.snapshotDate);
        node.completeTime = new Date(node.completeTime);
      });
      this.graphData = response.data.timeWindowGraph;
    }
  }
</script>

<style lang="scss" scoped>
.datapicker {
  margin-top: 35px;
  margin-left: 300px
}
</style>