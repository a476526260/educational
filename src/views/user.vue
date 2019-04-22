<template>
  <div class="container">
    <div class="condition">
      <div class="condition-item">
        <el-select v-model="searchData.class" clearable size="small" placeholder="请选择班级">
          <el-option v-for="item in classOptions"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
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
        <el-button type="primary" size="small" @click="importExcel">导入</el-button>
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
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
          <template slot-scope="scope">
            {{scope.row.sex | sex}}
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机">
        </el-table-column>
        <el-table-column
          prop="account"
          label="学号 | 工号">
        </el-table-column>
        <el-table-column
          label="所在班级">
          <template slot-scope="scope">
            {{valueToLabel(scope.row.squadid,classOptions)}}
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
      <div slot="title" class="dialog-title">{{editorType}}用户信息</div>
      <el-form label-position="right" :model="editorData" v-if="editorType !== '导入'">
        <el-form-item label="姓名：" label-width="100px" required>
          <el-input v-model="editorData.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="性别：" label-width="100px" required>
          <el-select v-model="editorData.sex" clearable size="mini" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄：" label-width="100px" required>
          <el-input v-model="editorData.age" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机：" label-width="100px" required>
          <el-input v-model="editorData.phone" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="所在班级：" label-width="100px" required>
          <el-select v-model="editorData.classid" clearable size="mini" placeholder="请选择班级">
            <el-option v-for="item in classOptions"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号 | 工号：" label-width="100px" required>
          <el-input v-model="editorData.userid" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码：" label-width="100px" required v-if="editorType ==='添加'">
          <el-input v-model="editorData.password" size="mini"></el-input>
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
  name: 'user',
  mixins: [pagination, tip],
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      editorType: '',
      editorID: 0,
      searchData: {
        class: ''
      },
      fileList: [],
      editorData: {
        name: '',
        sex: '',
        age: '',
        phone: '',
        classid: '',
        userid: '',
        password: '',
        file: '',
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getClassOption')
    })
  },
  mounted () {
    this.getTableData()
  },
  computed: {
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
  methods: {
    getTableData () {
      _axios.fetchGet('/admin/v1/user', {
        page: this.pageSetting.current,
        pagesize: this.pageSetting.pageSize,
        squadid: this.searchData.class,
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
    search() {
      this.getTableData();
    },
    handleAdd () {
      this.dialogFormVisible = true
      this.editorType = '添加'
      this.editorData.name = ''
      this.editorData.sex = ''
      this.editorData.age = ''
      this.editorData.phone = ''
      this.editorData.userid = ''
      this.editorData.classid = []
      this.editorData.password = ''
    },
    importExcel() {
      this.dialogFormVisible = true
      this.editorType = '导入'
      this.editorData.file = '';
    },
    handleEditor (data) {
      this.dialogFormVisible = true
      this.editorType = '编辑'
      this.editorID = data.id
      _axios.fetchGet('/admin/v1/user/' + data.id).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.editorData.name = result.data.name
          this.editorData.sex = result.data.sex
          this.editorData.age = result.data.age
          this.editorData.phone = result.data.phone
          this.editorData.userid = result.data.account
          this.editorData.classid = result.data.squadid
        }
      }).catch(err => {
        throw err
      })
    },
    handleDelete (data) {
      this.$confirm('确定删除本条信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          _axios
            .fetchDel('/admin/v1/user/' + data.id)
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
      switch (this.editorType) {
        case '添加':
          _axios.fetchPost('/admin/v1/user', {
            name: this.editorData.name,
            sex: this.editorData.sex,
            age: this.editorData.age,
            phone: this.editorData.phone,
            account: this.editorData.userid,
            squadid: this.editorData.classid,
            password: this.editorData.password
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
          _axios.fetchPut('/admin/v1/user/' + this.editorID, {
            name: this.editorData.name,
            sex: this.editorData.sex,
            age: this.editorData.age,
            phone: this.editorData.phone,
            account: this.editorData.userid,
            squadid: this.editorData.classid
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
        case '导入':
          if (this.editorData.file === '') {
            this.errorTip('请上传用户列表！');
            return false
          }
          _axios.fetchPost('/admin/v1/usersaveall', {
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
          break
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
    batchExport () {
      window.location.href = '/admin/v1/userexport?' + param({
        page: 1,
        pagesize: this.pageSetting.total,
        token: this.token,
        squadid: this.searchData.class
      });
    },
    valueToLabel (id, data) {
      if (data) {
        let item = data.filter(item => {
          return item.value === Number(id)
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
