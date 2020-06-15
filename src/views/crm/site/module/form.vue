<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增站点' : '编辑站点'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="学校">
        <treeselect v-model="form.schools" :options="schoolList" style="width: 370px;" placeholder="请选择所属学校" />
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="组织">
        <treeselect v-model="form.organization" :options="organizations" style="width: 370px;" placeholder="请选择组织架构" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/site'
import { getToken } from '@/utils/auth'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    organizations: {
      type: Array,
      required: true
    },
    schoolList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        title: '',
        schools: null,
        organization: null
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      edit(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { title: '', schools: null, organization: null}
    }
  }
}
</script>

<style scoped>
  .logo-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .logo-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .logo {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
