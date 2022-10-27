<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <CardDetail :title="'总销售额'" count="1">
            <template slot="charts">
              <div>
                <span>周同比 &nbsp;&nbsp; 56%</span>
                <svg
                  t="1666769041403"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2529"
                  width="16"
                  height="16"
                >
                  <path
                    d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z"
                    p-id="2530"
                  ></path>
                </svg>
                &nbsp;
                <span>日同比&nbsp; &nbsp; 19.96% </span>
                <svg
                  t="1666769098040"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3506"
                  width="16"
                  height="16"
                >
                  <path
                    d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z"
                    p-id="3507"
                  ></path>
                </svg>
              </div>
            </template>
            <template slot="footer">
              <span>日销售额 ￥ 1234</span>
            </template>
          </CardDetail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail :title="'总销售额'" count="2">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量 8798</span>
            </template>
          </CardDetail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail :title="'总销售额'" count="3">
            <template slot="footer">
              <span>日转化率78%</span>
            </template>
          </CardDetail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail :title="'总销售额'" count="4">
            <template slot="footer">
              <div>
                <span>周同比 &nbsp;&nbsp; 56%</span>
                <svg
                  t="1666769041403"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2529"
                  width="16"
                  height="16"
                >
                  <path
                    d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z"
                    p-id="2530"
                  ></path>
                </svg>
                &nbsp;
                <span>日同比&nbsp; &nbsp; 19.96% </span>
                <svg
                  t="1666769098040"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3506"
                  width="16"
                  height="16"
                >
                  <path
                    d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z"
                    p-id="3507"
                  ></path>
                </svg>
              </div>
            </template>
          </CardDetail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CardDetail from "./Detail";
import LineChart from "./lineChart";
export default {
  name: "Card",
  components: {
    CardDetail,
    LineChart,
  },
};
</script>
<style lang="">
</style>