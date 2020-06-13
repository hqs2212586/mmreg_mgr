<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增学校' : '编辑学校'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <el-upload
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :headers="headers"
          action=""
          class="logo-uploader">
          <img v-if="form.logo" :src="form.logo" title="点击上传logo" class="logo">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="组织">
        <treeselect v-model="form.organization" :options="organizations" style="width: 360px;" placeholder="请选择组织架构" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/school'
import { getToken } from '@/utils/auth'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganizationTree } from '@/api/organization'

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
    }
  },
  data() {
    return {
      organizations: [],
      loading: false, dialog: false,
      form: {
        title: '',
        logo: null,
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
  created() {
    this.getOrganizations();
  },
  methods: {
    getOrganizations() {
      getOrganizationTree().then(res => {
        this.organizations = res.detail
      })
    },
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
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: 'Logo上传成功',
        type: 'success',
        duration: 2500
      })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { title: '', logo: null, organization: null}
    }
  }
}
</script>

<style scoped>

</style>
