const data = require("./data.json");

module.exports = [
  {
    url: "/home/list",
    type: "get",
    response: (config) => {
      console.log("执行 home.js /home/list返回结果")
      const items = data.items;
      return {
        code: 200,
        data,
      };
    },
  },
];
