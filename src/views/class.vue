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
          prop="squad_name"
          label="班级名称">
        </el-table-column>
        <el-table-column
          prop="grade"
          label="所属年级">
        </el-table-column>
        <el-table-column
          prop="major"
          label="所修专业">
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
      <div slot="title" class="dialog-title">{{editorType}}班级</div>
      <el-form label-position="right" :model="editorData">
        <el-form-item label="所属年级：" label-width="100px" required>
          <el-select v-model="editorData.gid" clearable placeholder="请选择" size="mini">
            <el-option
              v-for="item in gradeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称：" label-width="100px" required>
          <el-input v-model="editorData.class_name" size="mini"></el-input>
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
  name: 'class',
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      editorData: {
        gid: '',
        class_name: '',
        major: ''
      }
    }
  },
  mixins: [pagination, tip],
  computed: {
    gradeOption () {
      return this.$store.state.gradeOption.map(item => {
        return {
          label: item.grade_name,
          value: item.id
        }
      });
    },
    majorOption () {
      return this.$store.state.majorOption.map(item => {
        return {
          label: item.major_name,
          value: item.id
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch('getGradeOption');
      vm.$store.dispatch('getMajorOption')
    })
  },
  mounted () {
    this.getTableData();
  },
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/squad', {
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
      this.editorData.gid = '';
      this.editorData.class_name = '';
      this.editorData.major = '';
    },
    handleEditor(data) {
      this.dialogFormVisible = true;
      this.editorType = '编辑';
      this.editorID = data.id;
      this.editorData.gid = data.gradeid;
      this.editorData.class_name = data.squad_name;
      this.editorData.major = data.majorid;
    },
    handleDelete(data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/squad/' + data.id)
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
      if (this.editorData.gid === '') {
        this.errorTip('请选择班级！');
        return false;
      }

      if (this.editorData.class_name === '') {
        this.errorTip('请填写班级名称！');
        return false;
      }
      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/squad', {
            gradeid: this.editorData.gid,
            squad_name: this.editorData.class_name,
            majorid: this.editorData.major
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
          _axios.fetchPut('/admin/v1/squad/' + this.editorID, {
            gradeid: this.editorData.gid,
            squad_name: this.editorData.class_name,
            majorid: this.editorData.major
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
