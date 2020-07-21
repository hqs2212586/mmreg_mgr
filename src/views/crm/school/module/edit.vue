<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <eForm ref="form" :schools="schools" :sup_this="sup_this" :is-add="false"/>
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
    schools: {
      type: Array,
      required: true
    }
  },
  mounted() {
    console.log(this.schools);
    console.log(this.data);
    this.$refs.form.fileAddList = [];
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      _this.form = {
        id: this.data.id,
        title: this.data.title,
        logo: this.data.logo,
        organization: this.data.organization
      };
      if (typeof(this.data.logo) === "string") {
        let obj = new Object();
        obj.url = this.data.logo;
        _this.fileAddList.push(obj);
      }
      _this.dialog = true;
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
