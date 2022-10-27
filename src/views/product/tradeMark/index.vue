<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable comma-dangle -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable no-empty -->
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
    <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">添加</el-button>
    <el-table style="width: 100%" :data="list">
      <!--- type=index 表示该列为展示序号
      prop对应列内容的字段名称
      -->
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌logol"
        width="width"
        align="center"
      >
        <!--使用作用域插槽 展示 品牌url对应的图片，而不是展示品牌url的地址 --->
        // eslint-disable-next-line vue/no-unused-vars, vue/no-unused-vars
        <template v-slot:default="slotProps">
          <!-- row 表示作用域插槽回传接收到的数据，{{row}}显示 实际上作用域插槽接收到的
        回传数据row表示每一行的数据
        官方文档解释：通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据
        "{row,$index}"是一种解构写法，可以结构到回传对象的row和$index属性
        -->
          <!-- <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column> -->

          <img
            :src="slotProps.row.logoUrl"
            :alt="slotProps.$index"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template v-slot:default="slotProps">
          <el-button type="warning" icon="el-icon-edit" aria-setsize="mini" @click="updateTradeMark(slotProps)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" aria-setsize="mini" @click="deleteTradeMark(slotProps)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- page-count:分页器连续页面按钮个数-->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="5"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next,jumper,->,total,sizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>    
    <el-dialog
      title="添加品牌"
      :visible.sync="dialogVisible"
       width="30%"
      :before-close="handleClose">
      <!---model 表示收集表单的数据放置到tmForm上
      注意 :model 不是v-model，:model 只是说 这个vue组件有一个model属性，这个属性绑定到了tmForm对象。 在当前的vue组件中我们在data中 初始化了tmForm对象，所以tmForm对象一定不为空。 :model 是v-bind:model.
      其次我们要考虑的是如何将 表单内部的组件的值绑定到 tmForm的属性上， 这个时候我们使用的是v-model 双向数据绑定。 值得注意的是 即便 el-form 没有使用:model来绑定tmForm，
      el-form内部的el-input等组件仍然可以对 tmForm的tmName属性进行 v-model双向绑定。

      el-form 通过v-bind 绑定model属性到tmForm对象上的主要原因是 用来确定表单提交是上传的数据

      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator
      -->
      <el-form style="90%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px"  prop="tmName">
          <el-input v-model="tmForm.tmName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌logol"  prop="logoUrl">
          <!---上传组件 收集数据不可以使用v-model，因为他不是表单元素
          action属性设置图片上传的地址
          ---->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
             <i v-else class="el-icon-plus avatar-uploader-icon"></i>
             <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确定</el-button>
      </div>
    
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 7,
      limit: 3,
      // 总数据条数
      total: 0,
      list: [],
      // 对话框显示或隐藏
      dialogVisible: false,
      // 上传图片使用的属性
      imageUrl: '',
      // 收集品牌信息
      tmForm: {
        tmName: '',
        logoUrl: '',
        id: ''
      },
      // 表单验证的规则对象 输入框事件监听(三)：blur与change的差异
      // 输入后值并没有发生变更change不会触发，blur会触发，
      // blur与change事件在绝大部分的情况下表现都非常相似，输入结束后，离开输入框，会先后触发change与blur，唯有两点例外（1，1. 没有进行任何输入时，不会触发change 2.输入后值没有发生变更change不会触发）。各个浏览下器我都试过了，顺序都将是 change-->blur-->submit  如果文本框的值没有改变那么将不触发change事件
      // 注意 ，这个rules 校验规则设置了对属性 tnName和logoUrl进行校验，但是当前的Vue对象并没有这两个属性，也就是说这个校验规则不是校验Vue对象的属性，那么el-form 通过:rules='rules'得到了校验规则，但是 如何知道要校验的数据呢？这是通过el-form-item 的prop属性来指定的， item的prop属性指定了要校验的属性名，但是对于el-form 他仅仅通过el-form-item的prop知道了属性名，应该在哪个对象上获取这个属性值呢， 这是通过el-formd的:model='tmForm' 来指定的 。
      // required为true ，则对应的el-form-item 的同名prop对应的表单前面会有一个星号表示必填。message表示提示信息， trgger表示用户行为设置，也就是什么时候触发这个校验。
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trgger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择图片' }
        ]
      }
    }
  },
  // 组件挂载完毕之后发送请求
  mounted() {
    console.log(this.$API)
    // 获取列表数据
    this.getPageList()
  },
  methods: {
    async getPageList() {
      // 解构出参数
      const { page, limit } = this
      console.log(page)
      console.log(limit)
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(selectedPage) {
      // 当前选中页码发生改变时执行
      console.log(selectedPage)
      this.page = selectedPage
      console.log(this.page)
      this.getPageList()
    },
    handleSizeChange(newSize) {
    // 每页条数发生改变的时候触发
      console.log(newSize)
      this.limit = newSize
      this.getPageList()
    },
    updateTradeMark(slotProps) {
      // 修改品牌,参数row表示当前修改的品牌信息
      console.log(slotProps)
      // 展示对话框
      this.dialogVisible = true
      this.tmForm.tmName = slotProps.row.tmName
      this.tmForm.logoUrl = slotProps.row.logoUrl
      this.tmForm.id = slotProps.row.id
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleClose(done) {
      console.log('handleClose')
      // 当用户点击右上角的x关闭对话框的时候，需要清除当前用户填写的品牌名称和上传得到的图片，避免下次点击添加按钮后 对话框展示上次填写的内容
      this.clearFormData()
      done()
    },
    handleCancel() {
      this.dialogVisible = false
      this.clearFormData()
    },
    addOrUpdateTradeMark() {
      // 校验
      this.$refs.ruleForm.validate(async(success) => {
        console.log('this')
        console.log(this)
        if (success) {
          // 发送亲求
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          console.log(result)
          // eslint-disable-next-line no-empty
          if (result.code === 200) {
            // this.$message(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            // elemnet-ui
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            this.getPageList()
            // 关闭对话框
            this.dialogVisible = false
            this.clearFormData()
          }
        } else {
          console.log('校验不通过')
        }
      })
    },
    deleteTradeMark(slotProps) {
      console.log(slotProps)
      // 弹框
      this.$confirm(`你确定要删除${slotProps.row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'

      }).then(async() => {
        // 点击确定的时候会触发
        const result = await this.$API.trademark.reqDeleteTradeMark(slotProps.row.id)
        if (result.code === 200) {
          // 如果删除成功，提示删除
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
        // 触发加载数据, 这个地方有一个注意的问题： 就是比如我当前是第7页，删除第七7的第一条数据，且第7页仅有一条数那么此时应该加载的页面变成第6页。也就是加载前一个页的数据。
        if (this.list.length === 1 && this.page > 0) {
          this.page = this.page - 1
        }
        this.getPageList()
      }).catch(() => {
        // 点击取消的时候触发
        this.$message({
          type: 'success',
          message: '删除失败'
        })
      })
    },
    clearFormData() {
      // 清空属性
      this.tmForm.tmName = ''
      this.tmForm.logoUrl = ''
      this.tmForm.id = ''
    }

  }// end methods
}
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
