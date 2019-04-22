<template>
  <div class="container">
    <div class="condition">
      <div class="condition-item">
        <el-select v-model="searchData.weekid" clearable filterable size="small" placeholder="请选择时间">
          <el-option
            v-for="item in weekOption"
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
          prop="weekid"
          label="周序">
        </el-table-column>
        <el-table-column
          prop="numb"
          label="节序">
        </el-table-column>
        <el-table-column
          prop="lesson_time"
          label="上课时间">
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
      <div slot="title" class="dialog-title">{{editorType}}上课时间</div>
      <el-form label-position="right" :model="editorData">
        <el-form-item label="周序：" label-width="100px" required>
          <el-select v-model="editorData.week" clearable filterable size="small" placeholder="请选择时间" :disabled="editorType === '编辑'">
            <el-option
              v-for="item in weekOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节序：" label-width="100px" required>
          <el-input v-model="editorData.num" size="small" :disabled="editorType === '编辑'"></el-input>
        </el-form-item>
        <el-form-item label="上课时间：" label-width="100px" required>
          <el-time-picker
            v-model="editorData.time"
            size="small"
            value-format="HH:mm"
            clearable
            :picker-options="{
              format: 'HH:mm'
            }"
            placeholder="选择上课时间">
          </el-time-picker>
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
  name: 'lessonTime',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      searchData: {
        weekid: '',
      },
      editorData: {
        week: '',
        num: '',
        time: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getWeekOption');
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
  },
  mounted() {
    this.getTableData();
  },
  mixins: [pagination, tip],
  methods: {
    getTableData() {
      _axios.fetchGet('/admin/v1/lessontime', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize,
        weekid: this.searchData.weekid
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
    search() {
      this.getTableData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.editorType = '添加';
      this.editorData.week = '';
      this.editorData.num = '';
      this.editorData.time = ''
    },
    handleEditor(data) {
      this.dialogFormVisible = true;
      this.editorType = '编辑';
      this.editorID = data.id;
      this.editorData.week = data.weekid;
      this.editorData.num = data.numb;
      this.editorData.time = data.lesson_time
    },
    handleDelete(data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/lessontime/' + data.id)
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
      if (this.editorData.week === '') {
        this.errorTip('请选择周序！');
        return false;
      }

      if (this.editorData.num === '') {
        this.errorTip('请填写节序！');
        return false;
      }

      if (this.editorData.time === '') {
        this.errorTip('请选择上课时间！');
        return false;
      }
      switch (this.editorType) {
        case '添加':
          console.log(this.editorData);
          _axios.fetchPost('/admin/v1/lessontime', {
            weekid: this.editorData.week,
            numb: this.editorData.num,
            lesson_time: this.editorData.time
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
          _axios.fetchPut('/admin/v1/lessontime/' + this.editorID, {
            lesson_time: this.editorData.time
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
