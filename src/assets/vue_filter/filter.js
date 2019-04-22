import Vue from 'vue'

export default (function () {
  Vue.filter('format', function (value) {
    let timestamp = Number(value * 1000);
    let date = new Date(timestamp)
    let year = date.getFullYear().toString();
    let month = ('0' + (date.getMonth() + 1)).toString().substr(-2);
    let day = ('0' + date.getDate()).toString().substr(-2)
    return year + '-' + month + '-' + day
  });
  Vue.filter('attendance', function (value) {
    switch (Number(value)) {
      case 1:
        return '正常'
      case 2:
        return '旷课'
      case 3:
        return '请假'
    }
  });
  Vue.filter('scoreYear', function (value) {
    switch (Number(value)) {
      case 1:
        return '第一学年'
      case 2:
        return '第二学年'
      case 3:
        return '第三学年'
      case 4:
        return '第四学年'
    }
  });
  Vue.filter('semester', function (value) {
    switch (Number(value)) {
      case 1:
        return '第一学期'
      case 2:
        return '第二学期'
    }
  });
  Vue.filter('midterm', function (value) {
    switch (Number(value)) {
      case 1:
        return '期中考试'
      case 2:
        return '期末考试'
    }
  });
  Vue.filter('sex', function (value) {
    switch (Number(value)) {
      case 1:
        return '男'
      case 2:
        return '女'
      case 0:
        return '未设置'
    }
  });
})()
