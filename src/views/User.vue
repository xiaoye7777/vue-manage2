<template>
  <div class="manage">
    <!-- 新增按钮触发的弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <!-- elementUI的表单组件嵌入进来 -->
      <el-form ref="form" inline :rules="rules" :model="form" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker type="date" value-format="yyyy-MM-DD" placeholder="选择日期" v-model="form.birth"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入地址"></el-input>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增按钮 -->
    <div class="manage-header">
      <el-button @click="handleAdd" type="primary">+ 新增</el-button>
      <!-- 搜索模块... -->
      <el-form inline :model="userForm">
        <el-form-item>
          <el-input placeholder="请输入名字" v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="common-tabel">
      <el-table stripe height="90%" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="sexLabel" label="性别">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sex === 1 ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄">
        </el-table-column>
        <el-table-column prop="birth" label="出生日期">
        </el-table-column>
        <el-table-column prop="addr" label="地址">
        </el-table-column>
        <el-table-column prop="addr" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页组件 -->
      <div class="pager">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handlePage">
        </el-pagination>
      </div>
    </div>


  </div>
</template>

<script>
import { getUser, addUser, editUser, delUser } from '../api'

export default {
  name: 'User',
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        age: '',
        sex: '',
        birth: '',
        addr: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birth: [{ required: true, message: '请选择生日', trigger: 'blur' }],
        addr: [{ required: true, message: '请填写地址', trigger: 'blur' }],
      },
      tableData: [

      ],
      modelType: 0, //0表示新增，1表示编辑
      total: 0, //当前的总数据条数，就是有几个数据
      pageData: {
        page: 1,
        limit: 10
      },
      userForm: {
        name: ''
      }
    }
  },
  methods: {
    submit() {
      console.log('点击了提交按钮', this.form)
      //validate是elementUI提供的表单的函数，参数是回调函数，该回调函数会在校验结束后被调用，
      //并传入两个参数：是否校验成功（boolean）和未通过校验的字段（object）。若不传入回调函数，则会返回一个 promise
      //这个的校验依据好像就是简单的填没填？全部有填写就true了不管格式对不对
      this.$refs.form.validate((valid) => {
        console.log('valid,', valid, 'form:', this.form)
        if (valid) {
          //处理弹框中的表单数据
          console.log('处理弹框中的表单数据', this.form)
          if (this.modelType === 0) {
            //说明是新增按钮
            console.log('要执行addUser了，看看form', this.form)
            addUser(this.form).then(() => {
              //此时已经新增成功了，那就需要更新一下页面的列表
              console.log('新增成功，现在要更新列表')
              this.getList()
            })
          } else {
            editUser(this.form).then(() => {
              //编辑成功，那就需要更新一下页面的列表
              this.getList()
            })
          }
          this.$refs.form.resetFields()  //清空表单数据
          this.dialogVisible = false //关闭弹窗
        }
      })
    },
    //弹窗关闭的时候触发，用来重置
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    cancel() {
      this.handleClose()
    },
    handleEdit(row) {
      this.modelType = 1
      this.dialogVisible = true
      //深拷贝哦
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleDelete(row) {
      console.log('点击了删除按钮')
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getList() {
      //获取用户数据
      getUser({ params: { ...this.userForm, ...this.pageData } }).then(({ data }) => {
        console.log(data)
        this.tableData = data.list
        this.total = data.count || 0
      })
    },
    handleAdd() {
      this.modelType = 0
      this.dialogVisible = true

    },
    //选择页码时的回调
    handlePage(val) {
      console.log('当前页码', val)
      this.pageData.page = val,
        this.getList()
    },
    // 右上角搜索按钮
    onSubmit() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.manage {
  height: 90%;

  .manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .common-tabel {
    position: relative;
    height: calc(100% - 62px);

    .pager {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>