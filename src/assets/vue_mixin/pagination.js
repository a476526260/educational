export default {
  data() {
    return {
      pageSetting: {
        current: 1,
        pageSize: 15,
        pageSizes: [10, 15, 20, 25],
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSetting.pageSize = val;
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageSetting.current = val;
      this.getTableData()
    }
  }
}
