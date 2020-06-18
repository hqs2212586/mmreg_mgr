<template>
  <div class="app-container">
    <eHeader :grades="grades" :schoolList="schoolList" :query="query"/>
    <el-row :gutter="28">
      <el-col :span="span">
        <!--表格渲染-->
        <tree-table v-loading="loading" :data="grades" :columns="columns" :expand-all="true" border size="small">
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <edit v-if="checkPermission(['admin','grade_all','grade_edit'])" :grades="grades" :schoolList="schoolList" :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                v-if="checkPermission(['admin','grade_all','grade_delete'])"
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
import { del, getGrades } from '@/api/grade'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import { getSchools } from '@/api/school'

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
        // {
        //   text: '学校',
        //   value: 'schools'
        // },
        {
          text: '开始日期',
          value: 'begin_time'
        },
        {
          text: '结束日期',
          value: 'end_time'
        },
        // {
        //   text: '创建时间',
        //   value: 'add_time'
        // },
        // {
        //   text: '更新时间',
        //   value: 'modify_time'
        // }
      ],
      span: 24,
      delLoading: false,
      sup_this: this,
      grades: [],
      gradeList: [],
      schoolList: []
    }
  },
  created() {
    this.getSchoolList();
    this.$nextTick(() => {
      this.init(
        this.size = 100
      )
    })
  },
  methods: {
    parseTime,
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return '';
      }
      return parseTime(date)
    },
    checkPermission,
    handleCurrentChange(val) {
      console.log(val);
      // this.row_data = val
      // this.show = true
      // this.table_show = false
    },
    beforeInit() {
      this.url = 'api/crm/grades/'
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
    getSchoolList() {
      let self = this;
      getSchools().then(res => {
        const newres = res.results.map(item => {
          return { ...item, label: item.title }
        })
        self.schoolList = newres;
        self.getGradeList()
      })
    },
    getGradeList() {
      let self = this;
      getGrades().then(res => {
        console.log(self.schoolList);
        self.grades = res.results;
        self.gradeList = JSON.parse(JSON.stringify(self.grades));

        // 为了将学校的id转为名称
        for (var i=0; i < self.gradeList.length; i++) {
          for (var j=0; j < self.schoolList.length; j++) {
            if (self.gradeList[i].schools === self.schoolList[j].id) {
              self.gradeList[i].schools = self.schoolList[j].title
            }
          }
          self.gradeList[i].begin_time = self.parseTime(self.gradeList[i].begin_time);
          self.gradeList[i].end_time = self.parseTime(self.gradeList[i].end_time);
          self.gradeList[i].add_time = self.parseTime(self.gradeList[i].add_time);
          self.gradeList[i].modify_time = self.parseTime(self.gradeList[i].modify_time);
        }
        console.log('#####', self.grades);
        console.log(self.gradeList)
      })
    }
  }
}
</script>

<style scoped>

</style>
