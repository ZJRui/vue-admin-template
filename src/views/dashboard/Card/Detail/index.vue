<template >
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <svg
        t="1666767610593"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2530"
        width="16"
        height="16"
      >
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z"
          p-id="2531"
          fill="#d4237a"
        ></path>
        <path
          d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z"
          p-id="2532"
          fill="#d4237a"
        ></path>
        <path
          d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z"
          p-id="2533"
          fill="#d4237a"
        ></path>
      </svg>
    </div>
    <div class="card-content">
        {{count}}
    </div>
    <div class="card-charts">
        <slot name="charts"></slot>
    </div>
    <div class="card-footer">
        <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "CardDetail",
  props:['title','count'],
  data(){
    return {
        a:''
    }
  }
};
</script>
<style scoped>
.card-header{
    display:flex;
    justify-content: space-between;

}
.card-content{
    font-size: 60px;
}
.card-charts{
    height: 80px;
    width: 100%;
    font-size: 14px;

}
.card-footer{
    border-top: 1px solid #eee;
    padding-top: 10px;
    font-size: 14px;

}
</style>