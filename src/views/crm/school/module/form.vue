<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增学校' : '编辑学校'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <el-upload
          action=""
          :limit="1"
          :file-list="fileListAdd"
          :auto-upload="false"
          list-type="picture-card"
          :on-change="handleLogoChange"
          :on-preview="handleLogoPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
      loading: false,
      dialog: false,
      dialogImageUrl: '',     // 详情图片地址
      dialogVisible: false,   // 详情图是否可见
      hideUploadAdd: false,
      fileListAdd: [],
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
      let self = this;
      let formData = new FormData();
      for (let key in this.form) {
        if (this.form[key] != null) {     // 抛出为null的logo字段
          formData.append(key, this.form[key]);
        }
      }
      this.fileListAdd.map(item => {      // 给logo键添加文件内容
        formData.append('logo', item.raw);
      });
      add(formData).then(res => {
        console.log('上传', res);
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
      let self = this;
      let formData = new FormData();
      for (let key in this.form) {
        if (this.form[key] != null) {     // 抛出为null的logo字段
          formData.append(key, this.form[key]);
        }
      }
      this.fileListAdd.map(item => {      // 给logo键添加文件内容
        formData.append('logo', item.raw);
      });

      edit(this.form.id, formData).then(res => {
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
    handleLogoChange(file, fileList) {
      // 图片类型限制
      const isJPG = file.raw.type === 'image/jpeg';
      const isPNG = file.raw.type === 'image/png';
      // 图片大小限制
      const isLt2M = file.raw.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      } else {
        console.log(fileList);
        this.fileListAdd = fileList;
      }
      if (fileList.length > 0) {
        this.hideUploadAdd = true;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleLogoPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
