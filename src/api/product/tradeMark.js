/* eslint-disable indent */
/* eslint-disable keyword-spacing */
/* eslint-disable no-multiple-empty-lines */

// 这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request'

// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 添加品牌 或 修改品牌 ，修改品牌时put请求， 两者的区别是参数中是否存在id
// 添加品牌的参数对象存在 品牌名称和品牌logoUrl
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if(tradeMark.id) {
        // 如果存在id
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
    }else{
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
    }
}



// 删除品牌
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})

