import Vue from 'vue'
import Vuex from 'vuex'
import * as _axios from './assets/javascript/http';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _token_: '',
    gradeOption: [],
    classOption: [],
    weekOption: [],
    majorOption: [],
    courseClassifyOption: [],
    courseOption: []
  },
  mutations: {

  },
  actions: {
    getGradeOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/grade', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.gradeOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    },
    getClassOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/squad', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.classOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    },
    getWeekOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/week', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.weekOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    },
    getMajorOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/major', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.majorOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    },
    getcourseClassifyOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/coursetype', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.courseClassifyOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    },
    getcourseOption({ commit, state }) {
      _axios
        .fetchGet('/admin/v1/course', {
          page: 1,
          pagesize: 1000000
        })
        .then(res => {
          if (res.data.code === 200) {
            state.courseOption = res.data.data;
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }
})
