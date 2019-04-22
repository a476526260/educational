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
          width="80"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="school_year"
          label="学年">
        </el-table-column>
        <el-table-column
          prop="semester"
          label="学期">
          <template slot-scope="scope">
            第{{scope.row.semester}}学期
          </template>
        </el-table-column>
        <el-table-column
          prop="week_num"
          label="学周">
          <template slot-scope="scope">
            第{{scope.row.week_num}}周
          </template>
        </el-table-column>
        <el-table-column
          label="时间范围">
          <template slot-scope="scope">
            <span style="color: #409EFF">{{scope.row.week_start | format}}</span> ~ <span style="color: #409EFF">{{scope.row.week_end | format}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditor(scope.row)" type="text">修改</el-button>
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
      <div slot="title" class="dialog-title">{{editorType}}学周信息</div>
      <el-form label-position="right" :model="editorData">
        <el-form-item label="学年：" label-width="100px" required>
          <el-input v-model="editorData.year" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="学期：" label-width="100px" required>
          <el-input v-model="editorData.semester" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="周序号：" label-width="100px" required>
          <el-input v-model="editorData.week_num" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间范围：" label-width="100px" required>
          <el-date-picker
            v-model="editorData.dateRange"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
  name: 'week',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      editorData: {
        year: '',
        semester: '',
        week_num: '',
        dateRange: []
      }
    }
  },
  mixins: [pagination, tip],
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/week', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize
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
      this.editorData.year = '';
      this.editorData.semester = '';
      this.editorData.week_num = '';
      this.editorData.dateRange = [];
    },
    handleEditor(data) {
      this.dialogFormVisible = true;
      this.editorType = '编辑';
      this.editorID = data.id;
      this.editorData.year = data.school_year;
      this.editorData.semester = data.semester;
      this.editorData.week_num = data.week_num;
      this.$set(this.editorData.dateRange, 0, this.format(data.week_start));
      this.$set(this.editorData.dateRange, 1, this.format(data.week_end));
    },
    editorSubmit() {
      if (this.editorData.year === '') {
        this.errorTip('请输入学年！');
        return false
      }
      if (this.editorData.semester === '') {
        this.errorTip('请输入学期！');
        return false
      }
      if (this.editorData.week_num === '') {
        this.errorTip('请输入周序号！');
        return false
      }
      if (this.editorData.dateRange.length === 0) {
        this.errorTip('请选择起始截至日期！');
        return false
      }

      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/week', {
            school_year: this.editorData.year,
            semester: this.editorData.semester,
            week_num: this.editorData.week_num,
            week_start: this.editorData.dateRange[0],
            week_end: this.editorData.dateRange[1],
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
          _axios.fetchPut('/admin/v1/week/' + this.editorID, {
            school_year: this.editorData.year,
            semester: this.editorData.semester,
            week_num: this.editorData.week_num,
            week_start: this.editorData.dateRange[0],
            week_end: this.editorData.dateRange[1],
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
      }
    },
    format(time) {
      let timestamp = Number(time * 1000);
      let date = new Date(timestamp);
      let year = date.getFullYear().toString();
      let month = ('0' + (date.getMonth() + 1)).toString().substr(-2);
      let day = ('0' + date.getDate()).toString().substr(-2)
      return year + '-' + month + '-' + day
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
    .operation{
      margin-bottom: 20px;
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
