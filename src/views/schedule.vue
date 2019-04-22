<template>
  <div class="container">
    <div class="condition">
      <div class="condition-item">
        <el-select v-model="searchCondition.class" clearable size="mini" placeholder="请选择班级">
          <el-option v-for="item in classOptions"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="condition-item">
        <el-select v-model="searchCondition.week" clearable filterable size="small" placeholder="请选择时间">
          <el-option
            v-for="item in weekOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="search">课程表查询</el-button>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="importExcel">课表导入</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        size="mini"
        tooltip-effect="light"
        style="width: 100%">
        <el-table-column
          type="index"
          width="80"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="weekid"
          label="课周">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.weekid,weekOption)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="squadid"
          label="班级">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.squadid,classOptions)}}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row)" type="text">课程表详情</el-button>
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
      <div slot="title" class="dialog-title">课表导入</div>
      <el-form label-position="right" :model="editorData">
        <el-form-item label="文件：" label-width="100px" required>
          <el-upload
            class="upload-demo"
            action="/admin/v1/upload"
            name="upload"
            :headers="{'token':token}"
            :file-list="fileList"
            :before-upload="checkfile"
            :on-success="handleUploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorSubmit" size="small">导入</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogScheduleVisible" width="1200px" class="dialog">
      <div slot="title" class="dialog-title">{{tableTitle}}</div>
      <el-table
        :data="scheduleData"
        tooltip-effect="light"
        style="width: 100%">
        <el-table-column
          prop="time"
          width="120"
          label="">
          <template slot-scope="scope">
            <span class="line-title">{{scope.row.time}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in columnList"
          :key="item.prop"
          :prop="item.prop"
          show-overflow-tooltip
          :label="item.label">
          <template slot-scope="scope" v-if="scope.row.hasOwnProperty(item.prop)">
            <p class="reference">课程：<b>{{scope.row[item.prop].courseName}}</b></p>
            <p class="reference">教室：<b>{{scope.row[item.prop].classRoom}}</b></p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as _axios from '../assets/javascript/http'
import pagination from '../assets/vue_mixin/pagination'
import tip from '../assets/vue_mixin/tip'

export default {
  name: 'schedule',
  mixins: [tip, pagination],
  data () {
    return {
      searchCondition: {
        class: '',
        week: ''
      },
      weekInfo: null,
      tableData: [],
      dialogFormVisible: false,
      columnList: [],
      editorData: {
        file: ''
      },
      fileList: [],
      dialogScheduleVisible: false,
      tableTitle: '',
      scheduleData: [],
    }
  },
  computed: {
    weekOption () {
      return this.$store.state.weekOption.map(item => {
        return {
          label: `第${item.week_num}周`,
          value: item.id
        }
      })
    },
    classOptions () {
      let _class = this.$store.state.classOption || []
      let option = []
      _class.forEach(item => {
        option.push({
          label: `${item.grade}-${item.squad_name}`,
          value: item.id
        })
      })
      return option
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getClassOption')
      vm.$store.dispatch('getWeekOption')
    })
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/timetable', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize,
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
    importExcel () {
      this.dialogFormVisible = true
      this.fileList = []
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
        this.editorData.file = response.data.path
        this.successTip('上传成功！')
        this.fileList = fileList.slice(-1)
      } else {
        this.errorTip(response.info)
      }
    },
    search () {
      this.handleDetail({ squadid: this.searchCondition.class, weekid: this.searchCondition.week })
    },
    handleDetail (data) {
      if (data.squadid === '' || data.weekid === '') {
        this.errorTip('请传入班级和课周！');
        return false
      }
      this.columnList = [
        {
          prop: 'Mon',
          label: '星期一'
        },
        {
          prop: 'Tue',
          label: '星期二'
        },
        {
          prop: 'Wed',
          label: '星期三'
        },
        {
          prop: 'Thu',
          label: '星期四'
        },
        {
          prop: 'Fri',
          label: '星期五'
        }
      ]
      _axios.fetchGet('/admin/v1/timetable', {
        page: 1,
        pagesize: 200000,
        squadid: data.squadid,
        weekid: data.weekid
      }).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.dialogScheduleVisible = true;
          this.tableTitle = `${this.valueToLabel(data.squadid, this.classOptions)} ${this.valueToLabel(data.weekid, this.weekOption)}课程表`;
          // 数据处理
          let _temp_ = result.data;
          let obj = {};
          let arr = [];
          this.scheduleData = [];
          if (_temp_.length > 0) {
            _temp_.forEach(item => {
              if (!this.scheduleData[item.numb - 1]) {
                this.$set(this.scheduleData, item.numb - 1, {})
                this.$set(this.scheduleData[item.numb - 1], 'time', `第${this.numToChn(item.numb)}节课`)
              }
              switch (item.week) {
                case 1:
                  this.$set(this.scheduleData[item.numb - 1], 'Mon', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 2:
                  this.$set(this.scheduleData[item.numb - 1], 'Tue', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 3:
                  this.$set(this.scheduleData[item.numb - 1], 'Wed', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 4:
                  this.$set(this.scheduleData[item.numb - 1], 'Thu', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 5:
                  this.$set(this.scheduleData[item.numb - 1], 'Fri', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 6:
                  this.$set(this.scheduleData[item.numb - 1], 'Sat', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
                case 7:
                  this.$set(this.scheduleData[item.numb - 1], 'Sun', {
                    courseName: item.course_name,
                    classRoom: item.classroom
                  })
                  break
              }

              if (!obj[item.week]) {
                obj[item.week] = 1;
                arr.push(item.week)
              }
            })
            if (arr.indexOf(6) > 0 || arr.indexOf(7) > 0) {
              this.$set(this.columnList, 5, {
                prop: 'Sat',
                label: '星期六'
              })
              this.$set(this.columnList, 6, {
                prop: 'Sun',
                label: '星期日'
              })
            }
          }
        }
      }).catch(err => {
        throw err
      })
    },
    editorSubmit () {
      if (this.editorData.file === '') {
        this.errorTip('请上传文件模板')
        return false
      }
      _axios.fetchPost('/admin/v1/timetablesaveall', {
        path: this.editorData.file
      }).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.successTip('导入成功！')
          this.dialogFormVisible = false
          this.fileList = []
        }
      }).catch(err => {
        throw err
      })
    },
    valueToLabel (id, data) {
      if (data) {
        let item = data.filter(item => {
          return item.value === Number(id)
        })
        return item.length > 0 ? item[0].label : '无id对应项'
      }
      return null
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
      height: 33px;
      min-height: 33px;
      margin-bottom: 20px;
      overflow: hidden;

      .condition-item {
        float: left;
        margin-right: 20px;
        width: 200px;
      }

      .condition-button {
        float: left;
        margin-right: 10px;
      }

      .el-select, .el-cascader, .el-button {
        width: 100%;
      }
    }

    .operation {
      margin-bottom: 20px;
    }

    .table-container {
      height: 100%;
      flex: 1;
      margin-bottom: 52px;
      overflow: auto;

      .table-title {
        margin-bottom: 20px;
        line-height: 32px;
        text-align: center;
        font-size: 16px;
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

    .el-dialog {
      .dialog-title {
        text-align: center;
        font-size: 18px;
      }
      .line-title{
        font-size: 14px;
        font-weight: bold;
      }
      .reference {
        display: block;
        font-size: 13px;
        line-height: 1.5;
        b {
          font-weight: normal;
        }
      }
      .dialog-footer {
        text-align: center;
      }
    }

  }
</style>
