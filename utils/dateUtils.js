export default {
  /**
   *  format date as yyyy-mm-dd
   */
  formatDate (d) {
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  },

  parseDateForGraphNode (nodes) {
    nodes.forEach(node => {
      node.snapshotDate = new Date(node.snapshotDate.replace(/-/g,"/"))
      node.completeTime = new Date(node.completeTime)
      if(node.storage && node.storage.startTime) {
        node.storage.startTime = new Date(node.storage.startTime)
      }
    })
  }

}