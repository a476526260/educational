export default {
  methods: {
    errorTip(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: 'error'
      });
    },
    successTip(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: 'success'
      });
    },
    warningTip(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      });
    }
  }
}
