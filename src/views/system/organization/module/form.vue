<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增组织' : '编辑组织'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" style="width: 360px;" placeholder="请选择组织类型">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!--只有两级组织架构，因此不需要显示站点-->
      <el-form-item style="margin-bottom: 0px;" label="学校组织">
        <el-select v-model="form.pid" style="width: 360px;" placeholder="请选择学校组织" :disabled="input_status">
          <el-option v-for="item in organizations" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/organization'

export default {
  props: {
    organizations: {
      type: Array,
      required: true
    },
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
      loading: false, dialog: false,
      form: { name: '', type: '', pid: null },
      types: [{ value: 'school', label: '学校' }, { value: 'site', label: '站点' }],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      input_status: true     // 默认不能选择父级组织
    }
  },
  watch: {
    'form.type': {
      handler(val) {
        let self = this;
        console.log(val);
        if (val === 'site') {    // site必须选择父级组织
          self.input_status = false;
        } else if (val === 'school') {    // school不能选父级组织
          self.input_status = true;
        }
      }
    }
  },
  mounted() {
    console.log(this.organizations);
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else {
            this.doEdit();
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm();
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        });
        this.loading = false;
        this.$parent.$parent.init();
        this.$parent.$parent.getOrganizations();
      }).catch(err => {
        this.loading = false;
        console.log(err);
      })
    },
    doEdit() {
      edit(this.form.id, this.form).then(res => {
        this.resetForm();
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        });
        this.loading = false;
        this.sup_this.init();
        this.sup_this.getOrganizations();
      }).catch(err => {
        this.loading = false;
        console.log(err);
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs['form'].resetFields();
      this.form = { name: '', type: '', pid: null };
    }
  }
}
</script>

<style scoped>

</style>
