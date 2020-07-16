<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="checkPermission(['admin','enrollstu_all','enrollstu_create'])"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true">新增</el-button>
      <eForm ref="form" :enroll_students="enroll_students" :gradesList="gradesList"
             :siteList="siteList" :traintypeList="traintypeList" :is-add="true"/>
    </div>
    <!-- 导出 -->
    <el-button
      v-if="checkPermission(['admin','enrollstu_all'])"
      :loading="downloadLoading"
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="download">导出</el-button>
    <!-- 导入 -->
    <el-upload
      v-if="checkPermission(['admin', 'enrollstu_all'])"
      class="filter-item"
      action=""
      :on-change="handleExcelImport"
      :show-file-list="false"
      :file-list="fileListUpload"
      :limit="1">
      <el-button size="mini" :loading="uploadLoading"
        type="primary" icon="el-icon-upload">导入</el-button>
    </el-upload>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    enroll_students: {
      type: Array,
      required: true
    },
    siteList: {
      type: Array,
      required: true
    },
    gradesList: {
      type: Array,
      required: true
    },
    traintypeList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      uploadLoading: false,
      fileTemp: null,     // 上传的临时文件
      fileListUpload: []
    }
  },
  methods: {
    checkPermission,
    toQuery() {
      console.log(this.query)
      this.$parent.page = 1
      this.$parent.init()
    },
    // 导出/下载
    download() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '姓名', '性别', '民族'];
        const filterVal = ['id', 'name', 'gender', 'nation'];
        const data = this.formatJson(filterVal, this.$parent.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        });
        this.downloadLoading = false
      })
    },
    // 导入
    handleExcelImport (file) {
      this.fileTemp = file.raw;

    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'gender') {
          return v[j] ? '女' : '男'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
