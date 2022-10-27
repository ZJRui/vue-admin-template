<!-- eslint-disable no-trailing-spaces -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <!--设置 inline 属性可以让表单域变为行内的表单域 ,让多个表单在一行内展示 -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!--@change 表示当 el-select选中的元素发生变化的时候会触发change事件，从而改变第二个下拉可选数据--->
        <el-select placeholder="请输入" v-model="cForm.category1Id" @change="handle1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>

      
      <el-form-item label="二级分类">
        <el-select placeholder="请输入" v-model="cForm.category2Id" @change="handle2" :disabled="show">
          <el-option  v-for="(c2,index) in list2 " :label="c2.name" :value="c2.id"  :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请输入"  v-model="cForm.category3Id" @change="handle3" :disabled="show">
          <el-option  v-for="(c3,index) in list3 " :label="c3.name" :value="c3.id" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集响应的分类id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 组件加载的时候获取一级分类属性
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      // 获取一级分类
      const result = await this.$API.attr.reqCategory1List()
      console.log(result)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类的select事件回调
    async handle1() {
      // 清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构 更新后的一级分类id
      const { category1Id } = this.cForm

      // 触发组件的自定义事件，将当前选中的一级分类数据传递给父组件
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      console.log(result)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async handle2() {
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      console.log(result)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handle3() {
      // 三级分类
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>
<style >
</style>
