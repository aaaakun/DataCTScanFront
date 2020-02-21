<template>
<div>
    <div> id: {{ node.id }} </div>
    <div> Type: {{ node.storage.__typename }} </div>
    <div> Snapshot Date: {{ node.snapshotDate.toLocaleDateString() }} </div>
    <div> Complete Time: {{ node.completeTime.toLocaleDateString() }} </div>
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