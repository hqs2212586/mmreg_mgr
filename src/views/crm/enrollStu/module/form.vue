<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增报名学生' : '编辑报名学生'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="78px">
      <el-form-item label="姓名" prop="title">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio :label=0>男</el-radio>
          <el-radio :label=1>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-input v-model="form.nation" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="籍贯" prop="birth_place">
        <el-input v-model="form.birth_place" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identity_num">
        <el-input v-model="form.identity_num" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="常用地址" prop="address">
        <el-input v-model="form.address" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="form.tel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="报读专业" prop="majors">
        <el-input v-model="form.majors" style="width: 370px;"/>
      </el-form-item>

      <el-form-item label="备注" prop="memo">
        <el-input v-model="form.memo" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/train_type'
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
    enroll_students: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        name: '',
        gender: 0,
        nation: '',
        birth_place: '',
        identity_num: '',
        address: '',
        tel: '',
        majors: '',
        memo: ''
      },
      rules: {
        name: [
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
      this.form = { title: ''}
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
