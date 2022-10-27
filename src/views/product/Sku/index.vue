<!-- eslint-disable no-trailing-spaces -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/name-property-casing -->
<!-- eslint-disable quotes -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable key-spacing -->
<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column label="名称" prop="skuName" width="80"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template v-slot:default="slotProps">
          <img
            :src="slotProps.row.skuDefaultImg"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="80" prop="weight"></el-table-column>
      <el-table-column label="价格" width="80" prop="price"></el-table-column>
      <el-table-column label="操作" width="width">
        <template v-slot:default="slotProps">
          <!---0表示处于下架，1表示上架状态中--->
          <el-button
            icon="el-icon-sort-up"
            size="mini"
            @click="handleOnSale(slotProps)"
            v-if="slotProps.row.isSale == 0"
          >
          </el-button>
          <el-button
            icon="el-icon-sort-down"
            size="mini"
            @click="handleCancelSale(slotProps)"
            v-else
          ></el-button>

          <el-button icon="el-icon-edit" size="mini"></el-button>
          <el-button
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(slotProps)"
          ></el-button>
          <el-button icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="currentPage"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="currentPageChange"
      layout="prev,pager,next"
    ></el-pagination>

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
          >
            {{ attr.attrId }}-{{ attr.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">图片</el-col>
        <el-col :span="16">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
             <img :src="item.imgUrl"/>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Sku",
  data() {
    return {
      records: [],
      total: 0,
      currentPage: 1,
      limit: 5,
      skuInfo: {},
      drawer: false, //需要设置 visible 属性，它的类型是 boolean,当为 true 时显示 Drawer
      direction: "rtl",
    };
  },
  mounted() {
    console.log("mounted");
    console.log(arguments);
    this.getSkuList();
  },
  methods: {
    currentPageChange(clickPage) {
      console.log(arguments);
      this.currentPage = clickPage;
      this.getSkuList();
    },
    async getSkuList() {
      let res = await this.$API.sku.reqSkuList(this.currentPage, this.limit);
      console.log(res);

      if (res.code == 200) {
        this.records = res.data.records;
        this.total = res.data.total;
      }
    },
    async handleOnSale(slotProps) {
      //处理上架1请求
      let res = await this.$API.sku.reqSale(slotProps.row.id);
      if (res.code == 200) {
        slotProps.row.isSale = 1;
        this.$message("上架成功");
      }
    },
    async handleCancelSale(slotProps) {
      let res = await this.$API.sku.reqCancelSale(slotProps.row.id);
      if (res.code == 200) {
        slotProps.row.isSale = 0;
        this.$message("下架成功");
      }
    },
    async getSkuInfo(slotProps) {
      let res = await this.$API.sku.reqSkuById(slotProps.row.id);
      if (res.code == 200) {
        this.skuInfo = res.data;
        this.drawer = true;
      }
    },
  },
};
</script>
<style >
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
