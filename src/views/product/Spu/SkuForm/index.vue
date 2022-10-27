<template >
  <div>
    <el-form ref="skuForm" label-width="80px">
      <el-form-item label="SPU名称">{{ spuInfo.spuName }}</el-form-item>
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          v-model="skuInfo.weight"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          rows="4"
          type="textarea"
          placeholder="描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <!---这个地方有一个注意事项
         （1）这里时一个v-for，因此会有多个el-select，那么对每一个el-select 他选中的数据我们应该 如何收集绑定，也就是应该如何 指定到Vue对象的属性上。
         如果我对每一个el-select 都v-model=“propertyA” 那么就会导致多个el-select 双向绑定到同一个属性身上。这显然是不合适的。
         2. 这里采用的解决方案 就是 将 el-select选中的数据 绑定到 el-select 所使用的对象自己身上。 也就是 v-model="attr.attrIdAndAttrValueId" 使得attr对象多出来一个
         attrIdAndAttrValueId属性

         3. el-option的value 包含了两部分， attr对象的id 和当前被遍历到的attrValue的id
         ---->
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, posIndex) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.attrIdandAttrValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, pindex) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <div>{{ row }}</div>
              <img :src="row.imgUrl" style="height: 100px; width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="setDefaultImg(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancelAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      spuInfo: {
        name: "",
      },
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //---
        skuName: "",
        price: 0,
        weight: 0,
        skuDesc: "",
        //-----
        skuImageList: [], //从服务获取的可以使用的图片
        skuDefaultImg: "",
        skuSaleAttrValueList: [], //销售属性
        skuAttrValueList: [], // 平台属性
        selectedImgList: [], // 保存那些被选中的图片数据
      },
    };
  },
  methods: {
    async initSkuData(category1Id, category2Id, spuInfo) {
      this.spuInfo = spuInfo;
      this.skuInfo.spuId = spuInfo.id;
      this.skuInfo.tmId = spuInfo.tmId;
      this.skuInfo.category3Id = spuInfo.category3Id;
      //获取sku 数据
      console.log(spuInfo);
      console.log(this);
      console.log(this.$API);
      let res = await this.$API.spu.reqSkuImageList(spuInfo.id);
      if (res.code == 200) {
        this.spuImageList = res.data;
        this.spuImageList.forEach((item) => {
          //新增一个响应式属性，该属性会控制 是否展示将图片设置为默认按钮
          this.$set(item, "isDefault", 0); //0表示 会显示 设置为默认 按钮
        });
      }
      let res2 = await this.$API.spu.reqSpuSaleAttrList(spuInfo.id);
      if (res2.code == 200) {
        this.spuSaleAttrList = res2.data;
      }
      console.log(category1Id);
      console.log(category2Id);
      console.log(spuInfo.category3Id);
      let res3 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spuInfo.category3Id
      );
      if (res3.code === 200) {
        this.attrInfoList = res3.data;
      }
    },
    cancelAddSku() {
      console.log("cancelAddSku");
      this.$emit("changeScene", { scene: 0, flag: "修改" });
      //清空数据
      Object.assign(this.$data, this.$options.data());
    },
    handleSelectionChange(params) {
      console.log(params);
      //参数params 表示 table中已经够选的行数据，但是需要注意的是table绑定的spuImageList 数组的元素中没有isDefault属性，而实际在保存发送的请求中需要 图片数据需要携带isdefault 来表示这个图片是否被设置为默认
      this.selectedImgList = params;
    },
    setDefaultImg(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async saveSkuInfo() {
      //reqAddSku
      const { attrInfoList, skuInfo } = this;
      //初始化一个空数组，然后放入数据
      skuInfo.skuAttrValueList = [];
      attrInfoList.forEach((item) => {
        if (item.attrIdAndAttrValueId) {
          //attrIdAndAttrValueId:"106:175" 分割后对数组进行解构
          const [attrId, valueId] = item.attrIdAndAttrValueId.split(":");
          let tmp = {
            attrId,
            valueId,
          };
          skuInfo.skuAttrValueList.push(tmp);
        }
      });

      skuInfo.skuSaleAttrValueList = [];
      this.spuSaleAttrList.forEach((item) => {
        if (item.attrIdandAttrValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdandAttrValueId.split(":");
          skuInfo.skuSaleAttrValueList.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
      });
      //整理图片数据
      skuInfo.skuImageList = this.selectedImgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      console.log(skuInfo);
      let res = await this.$API.spu.reqAddSku(skuInfo);
      if (res.code === 200) {
        this.$message("保存成功");
        this.$emit("changeScene", {
          scene: 0,
          flag: "添加",
        });
      }
    },
  },
};
</script>
<style>
</style>