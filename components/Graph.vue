<template>
  <div>
    <el-dialog :title="node.name" :visible.sync="dialogTableVisible" v-if="node.storage">
      <nodeInfo v-bind:node="node"/>
    </el-dialog>
    <div id="graphContainer"></div>
  </div>
  
</template>
<script>
  import Vue from 'vue'
  import { Component, Provide, Emit, Prop, Watch } from 'nuxt-property-decorator'
  import NodeInfo from '@/components/NodeInfo';

  @Component({
    components: { NodeInfo }
  })
  export default class Graph extends Vue {

    @Provide() 
    graph = null;

    @Provide() 
    node = {};

    @Provide() 
    dialogTableVisible = false;

    @Prop(Object) 
    graphData;

    @Emit()
    delayDaysCal(snapshotDate) {
      return Math.floor((new Date().getTime() - snapshotDate.getTime())/86400000);
    }

    @Watch('graphData')
    onGraphDataChange (data) {
      data.nodes.forEach(node => {
        const delayDays = this.delayDaysCal(node.snapshotDate);
        node.label = node.name;
        node.delayDays = delayDays;
        node.description = `delay: ${delayDays} days`;
        
        switch (node.storage.__typename) {
          case 'DDB': {
            node.logoIcon = {
              img: require('~/assets/img/Amazon-DynamoDB.svg'),
              width: 30,
              height: 30,
              offset: -15
            }
            node.style = {
              fill: "#F2C9E0"
            };
            break;
          }

          case 'Glue': {
            node.logoIcon = {
              img: require('~/assets/img/AWS-Glue.svg'),
              width: 30,
              height: 30,
              offset: -15
            }
            node.style = {
              fill: "#BFC0FF"
            };
            break;
          }

          case 'S3': {
            node.logoIcon = {
              img: require('~/assets/img/Amazon-Simple-Storage-Service-S3.svg'),
              width: 30,
              height: 30,
              offset: -15
            }
            node.style = {
              fill: "#CBFFC9"
            };
            break;
          }

          case 'JobRef': {
            node.logoIcon = {
              img: require('~/assets/img/Amazon-EMR.svg'),
              width: 30,
              height: 30,
              offset: -15
            }
            node.style = {
              fill: "#A69E8F"
            };
            break;
          }

          case 'EDX': {
            node.logoIcon = {
              img: require('~/assets/img/EDX-temp.svg'),
              width: 30,
              height: 30,
              offset: -15
            }
            node.style = {
              fill: "#C9F9FF"
            };
            break;
          }
        }

        if (delayDays < 3) {
          node.stateIcon = {
            img: require('~/assets/img/success.svg'),
          }
        } else if (delayDays < 5) {
          node.style = {
            fill: "#F2C53D"
          };
          node.stateIcon = {
            img: require('~/assets/img/warn.svg'),
          }
        } else {
          node.style = {
            fill: "#F23E2E"
          };
          node.stateIcon = {
            img: require('~/assets/img/error.svg'),
          }
        }
      });
      this.graph.read(data);
    }

    mounted () {
      // Config graph engine in brower
      if (process.client) {
        const width = document.getElementById('graphContainer').scrollWidth;
        const height = document.getElementById('graphContainer').scrollHeight || 500;
        const G6 = require('@antv/g6');
        this.graph = new G6.Graph({
          container: 'graphContainer',
          width,
          height,
          animate: true,
          layout: {
            type: 'dagre',         
            preventOverlap: true,
            rankdir: 'LR',
            nodesep: 5,
            ranksep: 20
          },
          modes: {
            default: [ 'drag-canvas', 'activate-relations', 'zoom-canvas' ]
          },
          defaultNode: {
            type: 'modelRect',
            size: [ 270, 80 ],
            labelCfg: {
              style: {
                fill: '#000000',
                fontSize: 12,
              },
              offset: 30,
            },
            descriptionCfg: {
              style: {
                fontSize: 12,
                fill: '#000000'
              },
              paddingTop: 0
            },
          },
          nodeStateStyles: {
            hover: {
              lineWidth: 2,
              stroke: '#1890ff'
            },
            active: {
              opacity: 1
            },
            inactive: {
              opacity: 0.2,
              fill: '#ffffff'
            }
          },
          defaultEdge: {
            size: 1,
            style: {
              endArrow: {
                path: 'M 4,0 L -4,-4 L -4,4 Z',
                d: 4
              }
            }
          },
          edgeStateStyles: {
            active: {
              stroke: '#999'
            }
          }
        });
        this.graph.read(this.graphData);
        this.graph.on('node:mouseenter', evt => {
          const { item } = evt;
          this.graph.setItemState(item, 'hover', true);
        });

        this.graph.on('node:mouseleave', evt => {
          const { item } = evt;
          this.graph.setItemState(item, 'hover', false);
        });

        this.graph.on('node:click', evt => {
          const { item } = evt;
          this.node = item._cfg.model;
          this.dialogTableVisible = true;
        });
      }
    }
  }
</script>

<style>
  .g6-tooltip {
    border: 1px solid #00ff00;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>