<template >
  <div>
    <el-card class="box-card">
      <div slot="header" class="header-search clearfix">
        <span>线上热门搜索</span>
       
        <el-dropdown class="more">
          <span class="el-dropdown-link">
             <i class="el-icon-more el-icon--right "></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-row>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  components: {
    LineCharts,
  },
};
</script>
<style lang="css" scoped>
.header-search {
  position: relative;
}
.more {
  position: absolute;
  right: 0;
}
</style>