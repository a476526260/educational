<template>
  <div>{{options}}</div>
</template>

<script>
import * as _axios from '../assets/javascript/http'

export default {
  name: 'test',
  data () {
    return {
      options: []
    }
  },
  mounted() {
    this.grageOption()
  },
  methods: {
    getGradeOption () {
      return new Promise((resolve, reject) => {
        _axios
          .fetchGet('/admin/v1/grade', {
            page: 1,
            pagesize: 1000000
          })
          .then(res => {
            if (res.data.code === 200) {
              resolve(res.data.data)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getClassOption() {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve('Hello,you see me now!')
        }, 3000)
      })
    },
    async grageOption () {
      let start1 = new Date().getTime();
      let see = await this.getClassOption();
      console.log(see);
      let end1 = new Date().getTime();
      console.log(end1 - start1);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
