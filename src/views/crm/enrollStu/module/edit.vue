<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <eForm ref="form" :enroll_students="enroll_students"
           :gradesList="gradesList" :siteList="siteList" :traintypeList="traintypeList"
           :sup_this="sup_this" :is-add="false"/>
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
  methods: {
    to() {
      const _this = this.$refs.form
      _this.form = {
        id: this.data.id,
        name: this.data.name,
        gender: this.data.gender,
        nation: this.data.nation,
        birth_place: this.data.birth_place,
        identity_num: this.data.identity_num,
        address: this.data.address,
        tel: this.data.tel,
        majors: this.data.majors,
        train_types: this.data.train_types,
        grades: this.data.grades,
        sites: this.data.sites,
        memo: this.data.memo
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
