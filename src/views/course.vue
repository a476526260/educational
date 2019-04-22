<template>
  <div class="container">
    <div class="operation">
      <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        size="mini"
        tooltip-effect="light"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="typeid"
          label="课程类别">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.typeid, courseClassifyOption)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="course_num"
          label="课程编号">
        </el-table-column>
        <el-table-column
          prop="course_name"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="credit"
          label="学分">
        </el-table-column>
        <el-table-column
          prop="evaluation_mode"
          label="考核方式">
          <template slot-scope="scope">
            {{scope.row.evaluation_mode === 1 ? '考试' : '考查'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="majorid"
          label="专业">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.majorid, majorOption)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeid"
          label="年级">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.gradeid, gradeOption)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="hour"
          label="课时">
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
      <div slot="title" class="dialog-title">{{editorType}}课程</div>
      <el-form label-position="right" :model="editorData">
        <el-form-item label="年级：" label-width="100px" required>
          <el-select v-model="editorData.grade" clearable size="small" placeholder="请选择年级">
            <el-option v-for="item in gradeOption"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业：" label-width="100px" required>
          <el-select v-model="editorData.major" clearable size="small" placeholder="请选择专业">
            <el-option v-for="item in majorOption"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类：" label-width="100px" required>
          <el-select v-model="editorData.type" clearable size="small" placeholder="请选择课程分类">
            <el-option v-for="item in courseClassifyOption"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程编号：" label-width="100px" required>
          <el-input v-model="editorData.course_num" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="课程名称：" label-width="100px" required>
          <el-input v-model="editorData.course_name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="学分：" label-width="100px" required>
          <el-input v-model="editorData.credit" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="考核方式：" label-width="100px" required>
          <el-radio-group v-model="editorData.evaluation_mode">
            <el-radio :label="1">考试</el-radio>
            <el-radio :label="2">考查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课时：" label-width="100px" required>
          <el-input v-model="editorData.hour" size="mini"></el-input>
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

export default {
  name: 'course',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      editorData: {
        type: '',
        course_num: '',
        course_name: '',
        credit: '',
        evaluation_mode: '',
        major: '',
        level: '',
        grade: '',
        length_of_schooling: '',
        hour: '',
      }
    }
  },
  mixins: [pagination, tip],
  mounted () {
    this.getTableData()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getMajorOption');
      vm.$store.dispatch('getGradeOption');
      vm.$store.dispatch('getcourseClassifyOption');
    })
  },
  computed: {
    majorOption () {
      return this.$store.state.majorOption.map(item => {
        return {
          label: item.major_name,
          value: item.id
        }
      })
    },
    gradeOption () {
      return this.$store.state.gradeOption.map(item => {
        return {
          label: item.grade_name,
          value: item.id
        }
      });
    },
    courseClassifyOption() {
      return this.$store.state.courseClassifyOption.map(item => {
        return {
          label: item.typename,
          value: item.id
        }
      });
    }
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/course', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize
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
    handleAdd () {
      this.dialogFormVisible = true
      this.editorType = '添加'
      this.editorData.type = ''
      this.editorData.course_num = ''
      this.editorData.course_name = ''
      this.editorData.credit = ''
      this.editorData.evaluation_mode = ''
      this.editorData.major = ''
      this.editorData.grade = ''
      this.editorData.hour = ''
    },
    handleEditor (data) {
      this.dialogFormVisible = true
      this.editorType = '编辑'
      this.editorID = data.id
      this.editorData.type = data.typeid
      this.editorData.course_num = data.course_num
      this.editorData.course_name = data.course_name
      this.editorData.credit = data.credit
      this.editorData.evaluation_mode = data.evaluation_mode
      this.editorData.major = data.majorid
      this.editorData.grade = data.gradeid
      this.editorData.hour = data.hour
    },
    handleDelete (data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/course/' + data.id)
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
      if (this.editorData.type === '') {
        this.errorTip('请选择课程分类！')
        return false
      }
      if (this.editorData.type === '') {
        this.errorTip('请选择课程分类！')
        return false
      }
      if (this.editorData.course_num === '') {
        this.errorTip('请填写课程编号！')
        return false
      }
      if (this.editorData.course_name === '') {
        this.errorTip('请选择课程名称！')
        return false
      }
      if (this.editorData.credit === '') {
        this.errorTip('请填写学分！')
        return false
      }
      if (this.editorData.evaluation_mode === '') {
        this.errorTip('请选择考核方式！')
        return false
      }
      if (this.editorData.level === '') {
        this.errorTip('请填写层次！')
        return false
      }
      if (this.editorData.grade === '') {
        this.errorTip('请填写年级！')
        return false
      }
      if (this.editorData.length_of_schooling === '') {
        this.errorTip('请填写学制！')
        return false
      }
      if (this.editorData.hour === '') {
        this.errorTip('请填写课时！')
        return false
      }

      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/course', {
            typeid: this.editorData.type,
            course_num: this.editorData.course_num,
            course_name: this.editorData.course_name,
            credit: this.editorData.credit,
            evaluation_mode: this.editorData.evaluation_mode,
            majorid: this.editorData.major,
            gradeid: this.editorData.grade,
            hour: this.editorData.hour
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('添加成功！')
              this.getTableData()
              this.dialogFormVisible = false
            }
          }).catch(err => {
            throw err
          })
          break
        case '编辑':
          _axios.fetchPut('/admin/v1/course/' + this.editorID, {
            typeid: this.editorData.type,
            course_num: this.editorData.course_num,
            course_name: this.editorData.course_name,
            credit: this.editorData.credit,
            evaluation_mode: this.editorData.evaluation_mode,
            majorid: this.editorData.major,
            gradeid: this.editorData.grade,
            hour: this.editorData.hour
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('修改成功！')
              this.getTableData()
              this.dialogFormVisible = false
            }
          }).catch(err => {
            throw err
          })
          break
      }
    },
    valueToLabel (id, data) {
      if (data) {
        let item = data.filter(item => {
          return item.value === Number(id);
        })
        return item.length > 0 ? item[0].label : ''
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;

    .operation {
      margin-bottom: 20px;
    }

    .table-container {
      height: 100%;
      flex: 1;
      margin-bottom: 52px;
      overflow: auto;
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
