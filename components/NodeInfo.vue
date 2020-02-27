<template>
<div>
    <div> id: {{ node.id }} </div>
    <div> Snapshot Date: {{ node.snapshotDate.toLocaleDateString() }} </div>
    <div> Complete Time: {{ node.completeTime.toLocaleDateString() }} </div>
    <div> teamName: {{ node.teamName }} </div>
    <div v-if="node.storage">
      <div v-for="(value, key) in node.storage" :key="key">{{ key === "__typename" ? "Type" : key }}: {{value}}</div>
    </div>
</div>
  
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default: () => {return {}}
    }
  }
}
</script>