<!-- eslint-disable comma-spacing -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable no-trailing-spaces -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/name-property-casing -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable key-spacing -->
<template>
  <div>
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!--第一部分-->
      <div v-show="scene == 0">
        <!--spu列表解构-->
        <el-button type="primary" @click="addSpu" :disabled="!category3Id"
          >添加spu</el-button
        >
        <el-table :data="records" style="width: 100%">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="100">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot:default="slotProps">
              <HintButton
                title="添加"
                type="primary"
                icon="el-icon-plus"
                @click="addSku(slotProps)"
              ></HintButton>
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                @click="updateSpu(slotProps)"
              ></HintButton>
              <HintButton
                title="查看"
                type="primary"
                icon="el-icon-info"
                @click="viewSkuInfo(slotProps)"
              ></HintButton>
              <el-popconfirm
                :title="`确定删除${slotProps.row.spuName}？`"
                @onConfirm="confirmDeleteSpu(slotProps)"
                @OnCancel="cancelDeleteSpu(slotProps)"
              >
                <!-- slot : reference	触发 Popconfirm 显示的 HTML 元素 -->
                <HintButton
                  title="删除"
                  type="primary"
                  icon="el-icon-delete"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :total="total"
          @current-change="handleCurrentPageChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spuForm"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="skuForm"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>

    <!--- :before-close="handleDialogClose"
    关闭前回调，清除对话框的数据，避免下次打开对话框 会先展示历史数据然后渲染新数据的清空
    -->
    <el-dialog
      :title="`${skuInfo.spuName}的sku列表`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleDialogClose"
    >
      <el-table :data="skuList" style="width:100%"  v-loading="loading">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格"  prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="图片">
          <template v-slot:default="slotProps">
           <img :src="slotProps.row.skuDefaultImg" style="height:100px;width:100px"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SpuForm from "@/views/product/Spu/SpuForm";
import SkuForm from "@/views/product/Spu/SkuForm";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      categoryId: "",

      currentPage: 1,
      limit: 2,
      records: [], // spu列表数据
      total: 0,
      scene: 0, // 0表示展示列表，1表示展示添加|修改spu 2表示展示添加SKU
      dialogVisible: false, //对话框展示
      skuInfo: {}, //当前被点击选中查看的sku
      skuList: [],
      loading:true
    };
  },
  components: {
    SkuForm,
    SpuForm,
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      }
      if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      }
      if (level === 3) {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList() {
      let result = await this.$API.spu.reqSpuList(
        this.currentPage,
        this.limit,
        this.category3Id
      );
      console.log(result);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleCurrentPageChange(page) {
      //current-change	currentPage 改变时会触发	当前页
      this.currentPage = page;
      this.getSpuList();
    },
    //添加spu
    addSpu() {
      this.scene = 1;
      //通知子组件 发送请求获取 添加spu 时 部分属性可以选择的数据
      this.$refs.spuForm.addSpu(this.category3Id);
    },
    updateSpu(slotProps) {
      this.scene = 1;
      console.log(slotProps);
      // 获取到子组件，然后调用子组件的方法 发送请求获取数据
      this.$refs.spuForm.initSpuData(slotProps.row);
    },
    changeScene({ scene, flag }) {
      //从请求参数对象中解构出两个变量
      this.scene = scene;
      console.log("flag:" + flag);
      if (flag == "添加") {
        // 回到第一页
        this.currentPage = 1;
      } else {
        //保持当前页不变
      }
      this.getSpuList();
    },
    async confirmDeleteSpu(slotProps) {
      console.log("confirmDeleteSpu");
      //确定删除spu
      let result = await this.$API.spu.reqDeleteSpu(slotProps.row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuList();
      } else {
        this.$message("删除失败");
      }
    },
    cancelDeleteSpu(slotProps) {},

    addSku(slotProps) {
      //添加sku
      this.scene = 2;
      this.$refs.skuForm.initSkuData(
        this.category1Id,
        this.category2Id,
        slotProps.row
      );
    },
    async viewSkuInfo(slotProps) {
      //查看指定的sku信息
      //展示对话框
      this.dialogVisible = true;
      //设置对话框名称
      this.skuInfo = slotProps.row;
      let res = await this.$API.spu.reqSkuList(this.skuInfo.id);
      console.log(this.$API.spu.reqSkuList(this.skuInfo.id))//输出的是Promise对象
      console.log(res)// 输出的是正确数据，服务器返回的数据
      if (res.code == 200) {
        this.skuList = res.data;
        this.loading=false
      }
    },
    handleDialogClose(done){
      console.log("arguments")
      console.log(arguments)

      this.skuInfo={}  
      this.skuList=[]
      //将loading属性设置为true，从而使得下次继续
      this.loading=true
      done()

    }
  }, // end methods
};
</script>
<style lang="less">
</style>
