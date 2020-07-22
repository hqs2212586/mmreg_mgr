<template>
  <div class="app-container">
    <eHeader :sites="sites" :organizations="organizations"
             :schoolList="schoolList" :query="query"/>
    <el-row :gutter="28">
      <el-col :span="span">
        <!--表格渲染-->
        <tree-table v-loading="loading" :data="sites" :expand-all="true" :columns="columns" border size="small">
          <el-table-column label="所属学校" width="175px">
            <template slot-scope="scope">
              <span>{{schoolDict[scope.row.schools]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="175px">
            <template slot-scope="scope">
              <span>{{parseTime(scope.row.add_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="175px">
            <template slot-scope="scope">
              <span>{{parseTime(scope.row.modify_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <edit v-if="checkPermission(['admin','site_all','site_edit'])"
                    :sites="sites" :data="scope.row" :organizations="organizations"
                    :schoolList="schoolList" :sup_this="sup_this"/>
              <el-popover
                v-if="checkPermission(['admin','site_all','site_delete'])"
                :ref="scope.row.id"
                placement="top"
                width="200">
                <p>确定删除本条数据吗?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </tree-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del, getSites } from '@/api/site'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import { getOrganizationTree } from '@/api/organization'
import { getSchools } from '@/api/school'

export default {
  components: { eHeader, edit, treeTable },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '站点名称',
          value: 'title'
        }
      ],
      span: 24,
      delLoading: false,
      sup_this: this,
      sites: [],
      organizations: [],
      schoolList: [],
      schoolDict: {}
    }
  },
  created() {
    this.getSiteList();
    this.getOrganizations();
    this.getSchoolList();
    this.$nextTick(() => {
      this.init(
        this.size = 100
      )
    })
  },
  methods: {
    parseTime,
    checkPermission,
    handleCurrentChange(val) {
      console.log(val);
      // this.row_data = val
      // this.show = true
      // this.table_show = false
    },
    beforeInit() {
      this.url = 'api/crm/schools/'
      const sort = 'id'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (value) { this.params['search'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err)
      })
    },
    getSiteList() {
      let self = this;
      getSites().then(res => {
        self.sites = res.results;
      })
    },
    getOrganizations() {
      getOrganizationTree().then(res => {
        this.organizations = res.detail;
      })
    },
    getSchoolList() {
      getSchools().then(res => {
        let newres = {};
        const newList = res.results.map(item => {
          newres[item.id] = item.title;
          return { ...item, label: item.title}
        });
        console.log(newres);     // {2: "三峡大学", 4: "阿达萨多"}
        this.schoolDict = newres;
        this.schoolList = newList;
      })
    }
  }
}
</script>

<style scoped>

</style>
