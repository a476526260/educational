<template>
  <div class="container">
    <div class="condition">
      <div class="condition-item">
        <el-input v-model="searchData.user" placeholder="请输入姓名" size="small"></el-input>
      </div>
      <div class="condition-item">
        <el-select v-model="searchData.course" clearable filterable size="small">
          <el-option
            v-for="item in courseOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="search">搜索</el-button>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="importExcel">成绩导入</el-button>
      </div>
      <div class="condition-button">
        <el-button type="primary" size="small" @click="batchExport">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        size="mini"
        tooltip-effect="light"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="userid"
          label="学生ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="学生姓名">
        </el-table-column>
        <el-table-column
          prop="exam_date"
          label="考试时间">
          <template slot-scope="scope">
            {{scope.row.exam_date | format}}
          </template>
        </el-table-column>
        <el-table-column
          prop="course_name"
          label="课程">
        </el-table-column>
        <el-table-column
          prop="score"
          label="分数">
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
      <div slot="title" class="dialog-title">{{editorType}}</div>
      <el-form label-position="right" :model="editorData" v-if="editorType !== '导入'">
        <el-form-item label="学生ID：" label-width="100px" required v-if="editorType === '添加'">
          <el-input v-model="editorData.user" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="考试时间：" label-width="100px" v-if="editorType === '添加'" required>
          <el-date-picker
            v-model="editorData.date"
            type="date"
            clearable=""
            size="mini"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程：" label-width="100px" required v-if="editorType === '添加'">
          <el-select v-model="editorData.course" clearable filterable size="mini">
            <el-option
              v-for="item in courseOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分数：" label-width="100px" required>
          <el-input v-model="editorData.score" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-position="right" :model="editorData" v-if="editorType === '导入'">
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
  name: 'achievement',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      searchData: {
        user: '',
        course: '',
      },
      editorData: {
        user: '',
        date: '',
        course: '',
        score: '',
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
    })
  },
  computed: {
    courseOption () {
      return this.$store.state.courseOption.map(item => {
        return {
          label: item.course_name,
          value: item.id,
        }
      })
    },
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/score', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize,
        userid: this.searchData.user,
        courseid: this.searchData.course
      }).then(res => {
        let result = res.data;
        if (result.code === 200) {
          this.tableData = result.data;
          this.pageSetting.total = result.ext.total;
        }
      }).catch(err => {
        throw err
      })
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.editorType = '添加';
      this.editorData.user = '';
      this.editorData.date = '';
      this.editorData.course = '';
      this.editorData.score = '';
      this.editorData.file = '';
    },
    handleEditor(data) {
      this.dialogFormVisible = true;
      this.editorType = '编辑';
      this.editorID = data.id;
      this.editorData.user = data.userid;
      this.editorData.date = data.exam_date;
      this.editorData.course = data.courseid;
      this.editorData.score = data.score;
      this.editorData.file = '';
    },
    importExcel() {
      this.dialogFormVisible = true;
      this.editorType = '导入';
      this.editorData.user = '';
      this.editorData.date = '';
      this.editorData.course = '';
      this.editorData.score = '';
      this.editorData.file = '';
      this.fileList = [];
    },
    handleDelete(data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/score/' + data.id)
            .then(res => {
              let result = res.data;
              if (result.code === 200) {
                this.successTip('删除成功！');
                this.getTableData();
              }
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(() => {
          this.errorTip('已取消');
        });
    },
    editorSubmit() {
      if (this.editorData.user === '' && this.editorType !== '导入') {
        this.errorTip('请输入学生ID');
        return false;
      }

      if (this.editorData.date === '' && this.editorType !== '导入') {
        this.errorTip('请选择考试时间');
        return false;
      }

      if (this.editorData.course === '' && this.editorType !== '导入') {
        this.errorTip('请选择课程');
        return false;
      }

      if (this.editorData.score === '' && this.editorType !== '导入') {
        this.errorTip('请输入分数');
        return false;
      }

      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/score', {
            userid: this.editorData.user,
            courseid: this.editorData.course,
            score: this.editorData.score,
            exam_date: this.editorData.date
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('添加成功！');
              this.getTableData();
              this.dialogFormVisible = false;
            }
          }).catch(err => {
            throw err
          })
          break;
        case '编辑':
          _axios.fetchPut('/admin/v1/score/' + this.editorID, {
            score: this.editorData.score
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('修改成功！');
              this.getTableData();
              this.dialogFormVisible = false;
            }
          }).catch(err => {
            throw err
          })
          break;
        case '导入':
          _axios.fetchPost('/admin/v1/scoresaveall', {
            path: this.editorData.file
          }).then(res => {
            if (res.data.code === 200) {
              this.successTip('导入成功！');
              this.dialogFormVisible = false;
              this.fileList = [];
            }
          }).catch(err => {
            throw err
          })
          break;
      }
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
        this.editorData.file = response.data.path;
        this.successTip('上传成功！');
        this.fileList = fileList.slice(-1);
      } else {
        this.errorTip(response.info)
      }
    },
    search() {
      this.getTableData();
    },
    batchExport () {
      window.location.href = '/admin/v1/scoreexport?' + param({
        page: 1,
        pagesize: this.pageSetting.total,
        token: this.token,
        userid: this.searchData.user,
        courseid: this.searchData.course
      });
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
    .table-container{
      height: 100%;
      flex: 1;
      margin-bottom: 52px;
      overflow: auto;
    }
    .pagination-container{
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 0;
      background: #fff;
      .total{
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
    .el-form{
      .el-form-item{
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .dialog-title{
      text-align: center;
      font-size: 18px;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
