<template>
  <div class="container">
    <div class="condition">
      <div class="form">
        <el-form label-position="right" :model="editorData">
          <el-form-item label="学员：" label-width="100px">
            <el-input v-model="searchData.userId" placeholder="用户id" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="课程：" label-width="100px">
            <el-select v-model="searchRelevant.class" clearable filterable size="mini" placeholder="请选择班级" @change="classesChange" v-if="step ===1">
              <el-option v-for="item in classOptions"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
              </el-option>
            </el-select>

            <el-select v-model="searchRelevant.week" clearable filterable size="mini" placeholder="请选择周序" @change="weekChange" v-if="step ===2">
              <el-option
                v-for="item in weekOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchRelevant.weekNum" clearable filterable size="mini" placeholder="请选择星期" @change="weeksChange" v-if="step ===3">
              <el-option
                v-for="item in weeksOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchData.schedule" clearable filterable size="mini" placeholder="请选择课程节次" @change="courseChange" v-if="step ===4">
              <el-option
                v-for="item in courseNumOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" label-width="100px">
            <el-radio-group v-model="searchData.status">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">旷课</el-radio>
              <el-radio :label="3">请假</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="buttons">
        <el-button type="primary" size="small" @click="searchReset">条件重置</el-button>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="primary" size="small" @click="batchImport">批量导入</el-button>
        <el-button type="primary" size="small" @click="batchExport">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        size="mini"
        width="100%"
        tooltip-effect="light"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="userid"
          show-overflow-tooltip
          label="学员">
          <template slot-scope="scope">
            {{`姓名：${scope.row.name} / 学员ID：${scope.row.userid}`}}
          </template>
        </el-table-column>
        <el-table-column
          prop="timetableid"
          show-overflow-tooltip
          label="课程">
          <template slot-scope="scope">
            {{`名称：${scope.row.course_name} / 课程ID：${scope.row.timetableid}`}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span class="status" :class="scope.row.status === 1? 'normal':'error'">{{scope.row.status | attendance}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditor(scope.row)" type="text">修改</el-button>
            <el-button size="mini" @click="handleDelete(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <div class="total">共<span>{{pageSetting.total}}</span>条数据</div>
      <el-pagination
        :current-page="pageSetting.current"
        :page-sizes="pageSetting.pageSizes"
        :page-size="pageSetting.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout=" prev, pager, next, sizes, jumper"
        :total="pageSetting.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" width="600px" custom-class="editor-dialog">
      <div slot="title" class="dialog-title">{{editorType}}考勤信息</div>
      <el-form label-position="right" :model="editorData" v-if="editorType==='添加'||editorType ==='编辑'">
        <el-form-item label="学员：" label-width="100px" required v-if="editorType === '添加'">
          <el-input v-model="editorData.user" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="课程：" label-width="100px" required v-if="editorType === '添加'">
          <el-select v-model="editorData.course" clearable filterable size="small">
            <el-option
              v-for="item in courseOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" label-width="100px" required>
          <el-radio-group v-model="editorData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">旷课</el-radio>
            <el-radio :label="3">请假</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form label-position="right" :model="uploadFile" v-if="editorType === '导入'">
        <el-form-item label="文件：" label-width="100px" required>
          <el-upload
            class="upload-demo"
            action="/admin/v1/upload"
            name="upload"
            :show-file-list="true"
            :file-list="fileList"
            :headers="{'token':token}"
            :before-upload="checkfile"
            :on-success="handleUploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorSubmit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _axios from '../assets/javascript/http'
import pagination from '../assets/vue_mixin/pagination'
import tip from '../assets/vue_mixin/tip'
import { param } from '../assets/javascript/util'

export default {
  name: 'attendance',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      searchData: {
        userId: '',
        schedule: '',
        status: 0
      },
      searchRelevant: {
        class: '',
        week: '',
        weekNum: ''
      },
      scheduleData: [],
      weeksOption: [],
      courseNumOption: [],
      step: 1,
      editorData: {
        user: '',
        course: '',
        status: ''
      },
      uploadFile: {
        file: ''
      },
      fileList: []
    }
  },
  mixins: [pagination, tip],
  mounted () {
    this.getTableData()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getcourseOption');
      vm.$store.dispatch('getClassOption');
      vm.$store.dispatch('getWeekOption')
    })
  },
  computed: {
    weekOption () {
      return this.$store.state.weekOption.map(item => {
        return {
          label: `第${item.week_num}周`,
          value: item.id,
        }
      })
    },
    courseOption () {
      return this.$store.state.courseOption.map(item => {
        return {
          label: item.course_name,
          value: item.id,
        }
      })
    },
    classOptions () {
      let _class = this.$store.state.classOption || []
      let option = []
      _class.forEach(item => {
        option.push({
          label: `${item.grade}-${item.squad_name}`,
          value: item.id,
        })
      })
      return option
    },
  },
  watch: {
    searchData: {
      handler: function (n) {
        setTimeout(this.getTableData, 200)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/attendance', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize,
        userid: this.searchData.userId,
        timetableid: this.searchData.schedule,
        status: this.searchData.status
      }).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.tableData = result.data
          this.pageSetting.total = result.ext.total
        }
      }).catch(err => {
        throw err
      })
    },
    classesChange(val) {
      if (val !== '') {
        this.step = 2;
      }
    },
    weekChange(val) {
      if (val !== '') {
        this.step = 3;
        _axios.fetchGet('/admin/v1/timetable', {
          page: 1,
          pagesize: 2000,
          weekid: this.searchRelevant.week,
          squadid: this.searchRelevant.class
        }).then(res => {
          if (res.data.code === 200) {
            this.scheduleData = [];
            this.scheduleData = res.data.data;
            this.scheduleData.forEach(item => {
              if (typeof this.weeksOption[item.week - 1] === 'undefined') {
                this.$set(this.weeksOption, item.week - 1, {
                  value: item.week,
                  label: `星期${this.numToChn(item.week)}`
                })
              }
            })
          }
        }).catch(err => {
          throw err
        })
      }
    },
    weeksChange(val) {
      if (val !== '') {
        this.step = 4
      }
      this.courseNumOption = [];
      this.scheduleData.filter(item => {
        return item.week === this.searchRelevant.weekNum
      }).forEach(item => {
        console.log(item)
        this.courseNumOption.push({
          value: item.id,
          label: `第${this.numToChn(item.numb)}节课`
        })
      })
    },
    courseChange(val) {},
    handleAdd () {
      this.dialogFormVisible = true
      this.editorType = '添加'
      this.editorData.user = ''
      this.editorData.course = ''
      this.editorData.status = ''
    },
    handleEditor (data) {
      this.dialogFormVisible = true
      this.editorType = '编辑'
      this.editorID = data.id
      this.editorData.user = data.userid
      this.editorData.course = data.lessonid
      this.editorData.status = data.status
    },
    handleDelete (data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/attendance/' + data.id)
            .then(res => {
              let result = res.data
              if (result.code === 200) {
                this.successTip('删除成功！')
                this.getTableData()
              }
            })
            .catch(err => {
              throw err
            })
        })
        .catch(() => {
          this.errorTip('已取消')
        })
    },
    editorSubmit () {
      if (this.editorData.user === '' && this.editorType === '添加') {
        this.errorTip('请填写用户id！')
        return false
      }
      if (this.editorData.course === '' && this.editorType === '添加') {
        this.errorTip('请填写课程！')
        return false
      }
      if (this.editorData.status === '' && this.editorType !== '导入') {
        this.errorTip('请选择用户状态！')
        return false
      }
      if (this.uploadFile.file === '' && this.editorType === '导入') {
        this.errorTip('请先上传文件！')
        return false
      }

      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/attendance', {
            userid: this.editorData.user,
            timetableid: this.editorData.course,
            status: this.editorData.status
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('添加成功！');
              this.getTableData();
              this.dialogFormVisible = false;
            }
          }).catch(err => {
            throw err
          })
          break
        case '编辑':
          _axios.fetchPut('/admin/v1/attendance/' + this.editorID, {
            status: this.editorData.status
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('修改成功！');
              this.getTableData();
              this.dialogFormVisible = false;
            }
          }).catch(err => {
            throw err
          })
          break
        case '导入':
          _axios.fetchPost('/admin/v1/attendancesaveall', {
            path: this.uploadFile.file
          }).then(res => {
            let result = res.data
            if (result.code === 200) {
              this.successTip('导入成功！');
              this.getTableData();
              this.dialogFormVisible = false;
              this.fileList = [];
            }
          }).catch(err => {
            throw err
          })
          break
      }
    },
    search () {
      this.getTableData()
    },
    checkfile (file) {
      if (!file) {
        this.errorTip('请选择模板!')
        return false
      }
      if (!/\.(xls|xlsx)$/.test(file.name)) {
        this.errorTip('文件必须是xls/xlsx/格式')
        return false
      }
    },
    handleUploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.uploadFile.file = response.data.path
        this.fileList = fileList.slice(-1)
      } else {
        this.errorTip(response.info)
      }
    },
    batchImport () {
      this.dialogFormVisible = true
      this.editorType = '导入'
      this.fileList = []
    },
    valueToLabel (id, data, msg) {
      if (data) {
        let item = data.filter(item => {
          return item.value === Number(id)
        })
        return item.length > 0 ? item[0].label : msg
      }
      return msg
    },
    batchExport () {
      window.location.href = '/admin/v1/attendanceexport?' + param({
        page: 1,
        pagesize: this.pageSetting.total,
        token: this.token,
        userid: this.searchData.userId,
        timetableid: this.searchData.schedule,
        status: this.searchData.status
      });
    },
    searchReset() {
      this.step = 1;
      this.searchData.schedule = '';
      this.searchData.userId = '';
      this.searchData.status = 0;
      this.searchRelevant.class = '';
      this.searchRelevant.week = '';
      this.searchRelevant.weekNum = '';
    },
    numToChn (n) {
      let Chn = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      return Chn[n]
    },
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;

    .condition {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      min-height: 120px;
      .form{
        margin-right: 20px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }

    .table-container {
      height: 100%;
      flex: 1;
      margin-bottom: 52px;
      overflow: auto;
      .status {
        &.normal {
          color: #409EFF;
        }
        &.error{
          color: #f00;
        }
      }
    }

    .pagination-container {
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 0;

      .total {
        position: absolute;
        left: 5px;
        font-size: 14px;
        line-height: 32px;
        color: #666;

        span {
          color: #409EFF;
        }
      }
    }

    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .dialog-title {
      text-align: center;
      font-size: 18px;
    }

    .dialog-footer {
      text-align: center;
    }
  }
</style>
