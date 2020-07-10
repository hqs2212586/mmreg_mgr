# mmreg_mgr

基于vue和elementUI开发的注册平台前台系统。

## 一、项目介绍和初始化
***本项目采用以下技术***

    vue 2.5.17
    elementUI 2.6.0
    webpack 4.16.5

***环境安装***

1、安装npm运行环境(略)

    安装前端项目依赖包

    cd mmreg_mgr
    npm install

2、修改你的配置文件

    mmreg_mgr/config
    dev.env.js #开发环境
    prod.env.js #生成环境


## 二、vue开发问题

1、表单中使用upload组件一起提交给后台

    在项目很多文件是和一些字段一起提交到后台，而elementui默认是添加文件直接上传。
    这就需要将auto-upload设置为false，阻止自动上传。
    before-upload和auto-upload是互斥的，当auto-upload是false的时候，before-upload事件是没作用的，所以使用on-change事件来代替。

```vue
<el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
  <el-form-item label="名称" prop="title">
    <el-input v-model="form.title" style="width: 370px;"/>
  </el-form-item>
  <el-form-item label="Logo" prop="logo">
    <el-upload
      action=""
      :limit="1"
      :file-list="fileListAdd"
      :auto-upload="false"
      list-type="picture-card"
      :on-change="handleLogoChange"
      :on-preview="handleLogoPreview"
      :on-remove="handleRemove"
      :class="{'hide': hideUploadAdd}"
      >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-form-item>
  <el-form-item style="margin-bottom: 0px;" label="组织">
    <treeselect v-model="form.organization" :options="organizations" style="width: 360px;" placeholder="请选择组织架构" />
  </el-form-item>
</el-form>
```


