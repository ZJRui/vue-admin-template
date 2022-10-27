<template >
  <div style="margin-top: 10px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-tabs class="tab" v-model="activeTabName">
          <el-tab-pane label="销售额" name="saleTab">用户管理</el-tab-pane>
          <el-tab-pane label="访问量" name="accessTab">配置管理</el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setToday" style="margin-right: 6px">今日</span>
          <span style="margin-right: 6px" @click="setWeek">本周</span>
          <span style="margin-right: 6px">本月</span>
          <span>本年</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div>
              <h3>门店{{ this.title }}排名</h3>
            </div>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeTabName: "saleTab",
      mycharts: null,
      date: [],
    };
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势", // mounted只会执行一次， 因此mounted中设置的title是固定的
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "yellowgreen",
        },
      ],
    });
  }, //emd mounted
  computed: {
    title() {
      return this.activeTabName == "saleTab" ? "销售额" : "访问量";
    },
  }, //end computed

  //监听属性
  watch: {
    title() {
      //重新修改图表的标题
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
      });
    },
  },
  methods: {
    setToday() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>
<style lang="css">
/**.el-card_header

https://www.bilibili.com/video/BV1Vf4y1T7bw/?p=193&spm_id_from=pageDriver&vd_source=ed9f3fef970d3188b36d901ef62c9f31
el-card的header底部有一个横线
*/
.el-card_header {
  border-bottom: none;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
</style>
<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.charts {
  height: 300px;
  width: 100%;
}
</style>