<template >
  <div>
    <el-row>
      <el-col :span="12">
        <Search></Search>
      </el-col>
      <el-col :spanswer45670 ="12">
        <Category></Category>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Category from "./Category";
import Search from "./Search";
export default {
  name: "Observe",
  components: {
    Category,
    Search,
  },
  mounted() {
    //获取mock数据
    this.$store.dispatch("getData");
  },
};
</script>
<style lang="css">
</style>