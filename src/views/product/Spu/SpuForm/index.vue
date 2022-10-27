<template >
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select value="" placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!--
            1.multiple	是否支持多选文件
            2.list-type:文件列表的类型 picture-card 照片墙
            3limit	最大允许上传个数
            4.on-success	文件上传成功时的钩子	function(response, file, fileList)
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handlePictureRemove"
          :on-success="handlePictureSuccess"
          multiple
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndName"
        >
          <!-- 我们将选中的 选项的id和名称作为value， 然后这个value通过v-model收集绑定到Vue对象的attrIdAndName 属性上--->
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="saleAttrName"
            label="属性名"
            width="width"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="属性名称列表"
          >
            <template v-slot:default="slotProps">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in slotProps.row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(slotProps, tag, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--给每一行的 row对象添加两个属性 inputVisible 和inputValue，
              因为这是一个表格，表格存在多行，因此不可以在vue对象上设置inputVisible和inputValue属性，不然Vue对象上的这两个属性会被多行共用，从而控制多行
              --->
              <el-input
                class="input-new-tag"
                v-if="slotProps.row.inputVisible"
                v-model="slotProps.row.inputValue"
                :ref="`{slotProps.row.id}-saveTagInput`"
                size="small"
                @keyup.enter.native="handleInputConfirm(slotProps)"
                @blur="handleInputConfirm(slotProps)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(slotProps)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="操作"
          >
            <template v-slot:default="slotProps">
              <el-button type="primary" icon="el-icon-delete"> </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <!--错误写法： @click="this.$emit('changeScene',0)"
        正确写法： @click="$emit('changeScene',0)"
        为什么不使用this，原因是 template中的使用到的属性本身就是在vue对象上的，
        因此我们可以直接使用$emit，因为这个$emit已经在vue对象上了。而不需要使用this。
        且 @click="testClick(this)"这种写法 会导致testClick接收到一个值为null的参数，
        因为 @click="testClick(this)"这种写法相当于在 当前的vue对象上获取 名称为this的属性，当前Vue对象并没有this名称的属性，因此是null
         -->
        <el-button type="primary" @click="cancelAddOrUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //   dynamicTags: ["标签一", "标签二", "标签三"],
      //   inputVisible: false,
      //   inputValue: "",

      dialogImageUrl: "",
      dialogVisible: false,
      // 关与这个spu， 这个spu收集当前的spu信息，当前Vue对象有两种展示方式：
      // 1,通过点击修改按钮跳转到了当前Vue，这个时候会通过 initSpuData方法发送请求获取指定的id spu的信息，服务器返回的对象 被赋值给了 当前vue对象的spu属性。
      //2,第二种情况就是 点击添加按钮 跳转到了当前的Vue，这个时候因为没有发送任何的请求获取spu信息，所以此时Vue对象的spu属性应该是一个空对象，但是 我们在当前vue的tempalte中使用到了 <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input> 这种响应式属性，因此初始化的时候spu 这个空对象应该要包含 spuname属性，因此vue对象的spu属性不应该是一个空对象，应该是包含了某些属性的空对象。
      spu: {
        //三级分类的id
        category3Id: 0,
        description: "",
        spuName: "",
        //平台的id
        tmId: 0,
        //收集SPU图片的信息
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [],
      attrIdAndName: "", //收集未选择的销售属性id 和name
    };
  },
  methods: {
    handlePictureRemove(file, fileList) {
      console.log(file, fileList);
      //收集数据
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureSuccess(response, file, fileList) {
      //照片墙图片上传成功的回调
      console.log(response);
      console.log(fileList);
      //将 上传成功之后 的新 fileList 更新到 vue对象的响应属性上
      //需要注意的是： spuImageList 最开始的时候是 当前Spu对象的spuImageList属性的值，这个属性的值是通过请求后端接口返回的图片列表，返回的接口数据中图片的名称和地址字段是imgName 和imgUrl，而el-upload 要求 组件的file-list 属性绑定的每一个图片都要有name和url字段，因此 我们在initSpuData中对 接口返回的对象新增了name和url属性。
      // 对于el-upload 组件通过上传接口 得到的图片响应数据 response中只有name和url属性
      // 也就是说 fileList 中 主动上传的图片没有imgName和imgUrl属性， 后续我们将vue对象的spuImageList 作为请求参数的时候 需要为spuImageList 中的对象添加imgName和imgUrl属性
      this.spuImageList = fileList;
    },
    testClick(param) {
      console.log(param);
    },
    async initSpuData(row) {
      //清空上一次打开该页面的数据
      this.clearData();
      let spuResult = await this.$API.spu.reqSpuInfo(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageResult.code == 200) {
        this.spuImageList = spuImageResult.data;
        //由于element ui的el-upload 照片墙的file-list属性 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]，数组元素必须要包含name和url属性， 而服务器返回的数据中使用了imgName 和imgUrl
        this.spuImageList.forEach((item) => {
          this.$set(item, "name", item.imgName);
          this.$set(item, "url", item.imgUrl);
          //   item.name=item.imgName;
          //   item.url=item.imgUrl
        });
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //
    handleClose(slotProps, tag, index) {
      //删除当前被点击的元素，有两种删除方式
      slotProps.row.spuSaleAttrValueList.splice(
        slotProps.row.spuSaleAttrValueList.indexOf(tag),
        1
      );
      //第二种删除方式，根据tag的index删除
      //   this.slotProps.row.spuSaleAttrValueList.splice(index,1)
    },

    showInput(slotProps) {
      //添加销售属性
      this.$set(slotProps.row, "inputVisible", true);
      this.$set(slotProps.row, "inputValue", "");
      //slotProps.row.inputVisible = true;
      //   this.$nextTick((_) => {
      //     console.log(this.$refs.saveTagInput)
      //     this.$refs.saveTagInput.input.focus();
      //   });
      //input输入框聚焦,为什么要让input输入框获取到焦点，这是因为我们依赖于输入框失去焦点的blur事件的触发 从而将input设置为隐藏， 如果这里不让其聚焦 那么就会出现input输入框失去焦点后没有触发blur事件的问题。
      this.$nextTick(() => {
        console.log(this.$refs[`{slotProps.row.id}-saveTagInput`]);
        this.$refs[`{slotProps.row.id}-saveTagInput`].focus();
      });
    },

    handleInputConfirm(slotProps) {
      // input 输入框的值被绑定到了 slotProps的row对象的inputValue属性身上
      const { baseSaleAttrId, inputValue } = slotProps.row;
      //trim() 方法返回一个从两头去掉空白字符的字符串，并不影响原字符串本身
      //inputValue=inputValue.trim() 因为前面inputValue被声明为了const，所以这里无法修改
      //属性值校验
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
      //every 方法为数组中的每个元素执行一次 callback 函数，直到它找到一个会使 callback 返回 falsy 的元素。如果发现了一个这样的元素，every 方法将会立即返回 false。否则，callback 为每一个元素返回 true，every 就会返回 true。callback 只会为那些已经被赋值的索引调用。不会为那些被删除或从未被赋值的索引调用
      let differentEvery = slotProps.row.spuSaleAttrValueList.every((item) => {
        // 确定是否有相同的，则所有的数据都应该不同
        return item.saleAttrValueName != inputValue.trim();
      });
      if (!differentEvery) {
        this.$message("输入值重复");
        return;
      }
      // input用户输入的值 是 inputValue，但是在表格中 是使用spuSaleAttrValueList数组中对象的saleAttrValueName属性展示的
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };

      slotProps.row.spuSaleAttrValueList.push(newSaleAttrValue);

      //   let inputValue = this.inputValue;
      //   if (inputValue) {
      //     this.dynamicTags.push(inputValue);
      //   }
      slotProps.row.inputVisible = false;
    },
    addSaleAttr() {
      // 当点击添加销售属性的时候 将当前选中的销售属性 添加到表格中。
      // 下拉选中的数据存放在了 attrIdAndName 属性中
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      //向表格中添加数据
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [], // 销售属性名称列表
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);

      //清空下拉选中的数据
      this.attrIdAndName = "";
    },
    async addOrUpdateSpu() {
      //
      let res = this.spuImageList.map((item) => {
        console.log(item.response && item.response.data);
        return {
          imgName: item.name,
          //a || b 等价于 a ? a : b
          //const a = 3; const b = -2;console.log(a&&b); 输出-2
          // a&&b: a真返回b, 否则返回a;
          //this.spuImageList 就是 el-upload的file-list,在handlePicutreSucces
          //中更新 spuImageList 为 el-upload 收集到的图片列表，收集到的图片列表中有部分是服务器返回的
          // {name:"Snipaste_2022-10-23_18-58-53.jpg"
          //     percentage:100
          //     raw:File
          //     response:{code:200
          // data:"http://139.198.127.41:9000/sph/20221025/Snipaste_2022-10-23_18-58-53.jpg"
          // message:"成功"
          // ok:true
          // }
          //     size:45731
          //     status:"success"
          //     uid:1666679809441
          //     url:"blob:http://localhost:9528/33c6f550-1b9f-4a1b-aef6-5441e358cb7d"}
          // 对于这样的数据他的url 属性是一个blob本地地址，真实的地址在response.data中
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      console.log(res);
      this.spu.spuImageList = res;
      let response = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (response.code === 200) {
        this.$message({
          type: "success",
          message: "更新成功",
        });
        //回到 场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      } else {
        this.$message("更新失败");
      }
    },
    clearData() {
    //   let spuInit = {
    //     //三级分类的id
    //     category3Id: 0,
    //     description: "",
    //     spuName: "",
    //     //平台的id
    //     tmId: "",
    //     //收集SPU图片的信息
    //     spuImageList: [],
    //     spuSaleAttrList: [],
    //   };
    //   this.spu = spuInit;
    //   this.tradeMarkList = [];
    //   this.spuImageList = [];
    //   this.saleAttrList = [];
    //   this.attrIdAndName = "";
    Object.assign(this.$data,this.$options.data())//VUE如何初始化/清空所有data响应式数据

    },
    async addSpu(category3Id) {
      // 点击添加spu 后组件数据初始化
      this.clearData();
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
      this.spu.category3Id = category3Id;
    },
    cancelAddOrUpdate() {
      console.log(this.spu);
      console.log(this.spu.id);
      if (this.spu.id) {
        console.log("true this.spu id");
      } else {
        console.log("false: this.spu.id");
      }
      console.log(this.spu.id ? "修改" : "添加");
      this.$emit("changeScene", {
        scene: 0,
        flag: this.spu.id ? "修改" : "添加",
      });
      this.clearData();
    },
  },
  computed: {
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item2) => {
          return item.name != item2.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>
<style >
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>