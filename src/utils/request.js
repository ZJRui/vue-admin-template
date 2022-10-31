import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store"; // 获取store中的token
import { getToken } from "@/utils/auth";


/**
 * 在下面我们 使用了 VUE_APP_BASE_APi 作为请求的前缀。 
 * 当我们打包生产环境 是 vue_app-base-api=/prod-api
 * 因此我们发送的所有的请求前面偶会带有 /prod-api.
 * 
 */

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 6000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    console.log(axios);

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();
      config.headers["token"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code !== 200) {
      // 响应失败,mock返回的是20000，服务器返回的是200

      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      /**
       * 注意这里返回的 是res，而不是response。 官方的示例中返回的是response.
       * 这里的response参数是AxiosResponse
       *
       *export interface AxiosResponse<T = any>  {
       *  data: T;
       *  status: number;
       *  statusText: string;
       *  headers: any;
       *  config: AxiosRequestConfig;
       *  request?: any;
       *}
       *
       */
      console.log("response", response, "res=response.data", res);

      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
