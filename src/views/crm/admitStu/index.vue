<template>
  <div class="app-container">
    <eHeader :train_types="train_types" :query="query"/>
    <el-row :gutter="28">
      <el-col :span="span">
        <!--表格渲染-->
        <tree-table v-loading="loading" :data="train_types" :expand-all="true" :columns="columns" border size="small">
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <edit v-if="checkPermission(['admin','admitstu_all','admitstu_edit'])" :train_types="train_types" :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                v-if="checkPermission(['admin','admitstu_all','admitstu_delete'])"
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
import { del, getTrainType } from '@/api/train_type'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'

export default {
  components: { eHeader, edit, treeTable },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'title'
        },
        {
          text: '创建时间',
          value: 'add_time'
        },
        {
          text: '更新时间',
          value: 'modify_time'
        }
      ],
      span: 24,
      delLoading: false,
      sup_this: this,
      train_types: []
    }
  },
  created() {
    this.getTrainTypeList();
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
      this.url = 'api/crm/train_types/'
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
    getTrainTypeList() {
      let self = this;
      getTrainType().then(res => {
        for (var i=0; i < res.results.length; i++) {
          res.results[i].add_time = self.parseTime(res.results[i].add_time)
          res.results[i].modify_time = self.parseTime(res.results[i].modify_time)
        }
        console.log(res);
        self.train_types = res.results;
      })
    }
  }
}
</script>

<style scoped>

</style>
