<template >
  <!--vue要求组件模板只有一个根元素的原因-->
  <a :title="title" style="margin:10px">
    <el-button type="primary" v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>
<script>
export default {
  name: "HintButton",
  props:['title'],
  data() {
    return {
     
    };
  },
};
</script>
<style >
</style>