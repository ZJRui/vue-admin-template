<!-- eslint-disable eqeqeq -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable no-trailing-spaces -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/name-property-casing -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable key-spacing -->
<template>
  <div>
    <el-card style="margin:20px;">
      <div slot="header"></div>
      <div>
        <!--给子组件绑定一个自定义事件，当 子组件 的 三级分类选择完成之后，刷新当前组件的 第二个 el-card ，子组件会传递数据到当前组件 中，当前组件拿到子组件的数据 后发送请求 刷新第二个el-card
        
        这个三级联动组件中的 三个input输入框  如果当前展示的是添加属性的操作div，则三级联动不可用。 如果当前展示的是 三级分类的属性表格，则三级联动可用，也就是说三级联动是否可用 和 属性isShowTable 关联， isShowTable属性是当前父组件Vue的属性，如何传递给子组件CategorySelect 来控制子组件中的三个input的可用性呢？ 可以通过props传递数据
         -->
        <CategorySelect @getCategoryId = "getCategoryId"  :show="!isShowTable"></CategorySelect>
      </div>
    </el-card>
    <el-card style="margin:20px">
      <div v-show="isShowTable">
        <!---当category3Id存在的时候 添加属性才可用-->
          <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="handleAddAttr">添加属性</el-button>
       <el-table
        :data="attrList"
        style="width: 100%">
        
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>

        <el-table-column
          prop="attrName"
          label="属性名称"
          width="100">
        </el-table-column>

        <el-table-column
          label="属性值列表">
          <template v-slot:default="slotProps">
            {{ slotProps.row }}
            <el-tag v-for="(attrValue,index) in slotProps.row.attrValueList" type="success" :key="attrValue.id"  style="margin-right:10px">{{ attrValue.valueName }}</el-tag>
          </template>
        </el-table-column>

         <el-table-column
          prop="prop"
          label="操作"
          width="250">
          <template v-slot:default="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEditAttr(slotProps)">修改</el-button>
            <el-button type="primary" icon="el-icon-danger" size="mini" >删除</el-button>
          </template>
        </el-table-column>
        
       </el-table>
      </div>

      <!--修改属性的div--->
      <div v-show="!isShowTable">
        <el-form ref="attrAddEditForm"  label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName"  placeholder="请输入属性名"></el-input>
          </el-form-item>  
        </el-form>
          <el-button type="primary" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
          <el-button type="primary" @click="isShowTable=true">取消</el-button>
          <el-table :data="attrInfo.attrValueList">
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              label="序号" >
            </el-table-column>

            <el-table-column
              header-align="center"
              align="center"
              prop="prop"
              label="属性值名称">
              <template v-slot:default="slotProps">
                <!--绑定到attrInfo对象的 attrValueList这个数组中的每一个对象 中的valueName属性--->
                <el-input v-model="slotProps.row.valueName" placeholder="请输入属性值名称" size="mini" v-if="slotProps.row.flag" @blur="toLook(slotProps)" @keyup.native.enter="toLook(slotProps)" :ref="slotProps.$index" ></el-input>
                <!--
                  给 a span添加标签时为什么要加上display：block？
                  因为<a><span>不是块级元素是行内元素，不能够设置元素尺寸，   定义display：block后，设置和长度有关，或者其它的属性才会有效果。
                  行内元素对于点击 只能够点击其文字才会触发click；而在这里我们想实现的效果是点击这个单元格触发click，因此使用display:block
                -->
                <span v-else @click="toEdit(slotProps)" style="display:block;">{{ slotProps.row.valueName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              header-align="center"
              align="center"
              prop="prop"
              label="操作" >
              <template v-slot:default="slotProps">
                <el-popconfirm :title="'确定删除'+slotProps.row.valueName +'吗？'" confirm-button-text="确定" cancel-button-text="取消" @onConfirm="confirmDeleteAttrValue(slotProps)">
                  <!--slot reference参数： 触发Popconfirm显示的html元素，也就是点击这个按钮就会触发popconfirm显示-->
                  <el-button type="primary" icon="el-icon-delete" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length==0">保存</el-button>
          <el-button type="primary" @click="isShowTable=true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>
<script>
// 引入深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowTable: true, // 控制表格是否展示，如果表格不展示则展示就是添加属性
      attrInfo: { // 收集新增属性| 修改属性
        attrName: '', // 属性名
        attrValueList: [
          // { id: 属性值本身的id，valueName：属性值的名称， attrId:这个属性值所关联的属性的id}

        ], // 属性值列表
        categoryId: 0, // 三级分类的id
        categoryLevel: 3,
        id: '' // id 表示属性id，比如说三级分类 电子书 有一个属性 叫做 分类，这个属性有很多属性值，比如言情、武侠等， 这里的言情武侠就对应着 attrValueList ，每一个属性值都是通过attrId字段归属于 他关联的属性
      }
    }
  },
  methods: {
    // 自定义事件回调。 子组件触发自己的自定义事件的时候会传递相关的数据 给 父组件的 这个方法。
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        if (this.category3Id) {
          // 请求
          this.getAttrList()
        }
      }
    },
    async  getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      console.log(result)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    handleAddAttr() {
      // 表格隐藏
      this.isShowTable = false
      // 清空 添加属性div 保存的上一次添加时填写的数据，
      this.attrInfo.attrName = ''
      this.attrInfo.attrValueList = []
      this.id = ''
      this.attrInfo.categoryId = this.category3Id
      this.attrInfo.categoryLevel = 3
    },
    handleEditAttr(slotProps) {
      this.isShowTable = false
      const rowData = slotProps.row
      // 现在有一个问题， rowData 表示当前行被点击的行的数据， 我们要将这个数据传递给
      // this.attrInfo ，然后 修改属性的div会渲染 attrInfo
      // 问题在于 修改属性的div 中存在取消按钮，如果按照下面的写法，那么 attrInfo的attrValueList  与 rowData的attrValueList 引用的是同一个对象。 因此
      //  当你修改了attrInfo的attrValueList属性所引用的数组对象中的对象后 会导致rowData的属性引用的对象发生变化，，因此针对attrValueList 我们要使用深度拷贝。
      this.attrInfo.attrName = rowData.attrName
      // this.attrInfo.attrValueList = rowData.attrValueList
      this.attrInfo.attrValueList = cloneDeep(rowData.attrValueList)

      // 对深拷贝得到的attrValueList 中的每一个数据添加flag属性，需要注意的是通过下面的方式虽然给 数组中的每一个元素添加了falg属性，但是这种方式添加的属性 不会被vue检测，因此当我们修改对象的falg属性的时候 不会触发Vue的响应式事件，flag不是响应式数据
      this.attrInfo.attrValueList.forEach(item => {
        // item.flag = false 错误写法
        // 正确写法
        // Vue.set向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property (比如 this.myObject.newProperty = 'hi')
        this.$set(item, 'flag', false)
      })
      // 记录当前被 修改的属性的id
      this.attrInfo.id = rowData.id
      this.attrInfo.categoryId = this.category3Id
      this.categoryLevel = 3
    },
    addAttrValue() { // 添加属性值回调
    // 数组的push方法，添加一个对象到数组中，被添加对象A的所有属性在push的时候会自动 具备 响应式功能。但是push之后通过 A.propA='a'这种方式为A对象添加的propA不具备响应式功能。也就说push时 A对象的所i有属性都具备响应式，push之后给A对象新增的属性不具备响应式，需要使用$set
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 当前属性值 关联的属性id
        valueName: '', //  这个valueName 就是属性值名称
        flag: true // 注意这里我们添加了一个falt属性，用来标记当前行数据是处于编辑状态还是查看状态，但是这样有一个问题，对于新增的数据他会添加flag属性，对于点击修改按钮handleEditAttr方法中带过来的数据他本身没有flag属性，因此我们要在handleEditAttr 方法中对深拷贝得到的数据添加falg属性
      })
      // 当点击添加的时候 最后面的一行的input聚焦
      this.$nextTick(function() {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    toLook(slotProps) {
      // 确定用户输入是否未空
      // eslint-disable-next-line eqeqeq
      if (slotProps.row.valueName.trim() == '') {
        this.$message('请输入一个正常的属性值')
        return
      }
      // 确定是否存在重复 some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
      // some() 方法会依次执行数组的每个元素：
      const isRepat = this.attrInfo.attrValueList.some(item => {
        // 如果当前行所在元素 不等于当前被遍历到的元素 则校验是否名称相同
        // eslint-disable-next-line eqeqeq
        if (slotProps.row != item) {
          // eslint-disable-next-line eqeqeq
          return slotProps.row.valueName == item.valueName
        }
      })
      if (isRepat) {
        this.$message('输入属性名存在重复')
        return
      }
      // 当 input输入框失去焦点或者 回车的时候 当前行就变成 查看状态
      slotProps.row.flag = false
    },
    toEdit(slotProps) {
      // 当span标签被点击的时候 就变成编辑状态
      // 注意span标签不是块状元素，因此默认情况下对span的点击只能够点击文字才会触发click事件，点击周围的空白不能触发click。 为了将span标签设置为块，可以使用display:block 属性，这样点击span标签的空白部分也能够响应click事件
      // 因为<a><span>不是块级元素是行内元素，不能够设置元素尺寸，   定义display：block后，设置和长度有关，或者其它的属性才会有效果。
      slotProps.row.flag = true

      // 获取到当前被点击的span对应的input标签，然后让input标签聚焦
      // 注意：1，关于为什么时 this.$refs[$index]而不是 this.$refs.$index参考 js对象属性通过“.”和“[ ]”访问的区别
      console.log(slotProps)
      console.log(this.$refs)
      // 为什么要使用nextTick？ 参考 Vue.js实战 7.6.1nextTick，主要原因时我们通过v-if 来控制 input组件的展示与否，v-if会决定是否渲染这个组件，当你将v-if的属性设置为true的时候 这个时候组件并不会立即被渲染，因为之前v-if时false，所以dom中没有这个组件节点，因此我们直接使用 $refs来获取组件是获取不到的，需要使用nextTick延迟到下一次
      this.$nextTick(function() {
        console.log(this.$refs[slotProps.$index])
        this.$refs[slotProps.$index].focus()
      })
    },
    confirmDeleteAttrValue(slotProps) {
      // 气泡弹出框确定删除 属性值 splice()方法可以删除数组中任意位置的元素。splice(index, number); index：表示从第几个元素开始；number： 表示从此元素开始，向后删除几个元素
      this.attrInfo.attrValueList.splice(slotProps.$index, 1)
    },
    async addOrUpdateAttr() {
      // 保存按钮点击的时候 发送请求保存或者更新 属性 对应的属性值
      // 过滤属性值为空的行，删除falg属性， filter方法会返回一个新的数组
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName) {
          delete item.flag
          return true
        }
      })
      try {
        const reqData = cloneDeep(this.attrInfo)
        // 为什么这里要删除id，这是因为 reqAddOrUpdateAttr这个请求的参数中 没有id这个参数，如果带了id参数 会导致请求报错，提示数据无法修改
        delete reqData.id
        const result = await this.$API.attr.reqAddOrUpdateAttr(reqData)
        console.log(result)
        // 切换展示table
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        // 重新加载三级分类的平台属性
        this.getAttrList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less">
</style>
