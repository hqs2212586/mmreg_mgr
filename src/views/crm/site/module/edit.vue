<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <eForm ref="form" :sites="sites" :organizations="organizations" :schoolList="schoolList" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    sites: {
      type: Array,
      required: true
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
  methods: {
    to() {
      const _this = this.$refs.form
      _this.form = {
        id: this.data.id,
        title: this.data.title,
        schools: this.data.schools,
        organization: this.data.organization
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
