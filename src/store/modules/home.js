import mockRequest from '@/utils/mockRequest'

const state={
  list:{}
}
const mutations={
    GETDATA(state,list){
        state.list=list
    }
}
const actions={
    //发送请求获取首页mock数据
    async getData({commit}){
        let res=await mockRequest.get('/home/list');
        console.log(res)
        if(res.code==200){
            commit("GETDATA",res.data)
        }
    }
}
const getters={}


export default {
    state,
    actions,
    mutations,
    getters
}