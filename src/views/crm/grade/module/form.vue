<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增招生批次' : '编辑招生批次'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开始">
        <div class="block">
          <el-date-picker
            v-model="form.begin_time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="结束">
        <div class="block">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="学校">
        <treeselect v-model="form.schools" :options="schoolList" style="width: 370px;" placeholder="请选择所属学校" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label=0>往期批次</el-radio>
          <el-radio :label=1>当前批次</el-radio>
          <el-radio :label=2>未来批次</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/grade'
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
    grades: {
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
        begin_time: '',
        end_time: '',
        schools: null,
        status: null
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
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
      this.form = { title: '', schools: null, status: null}
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
