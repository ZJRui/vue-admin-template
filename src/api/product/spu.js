/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable comma-spacing */
import request from '@/utils/request'

/**
 * 输出：
 * this is request
ƒ wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  }
 */
console.log("this is request")
console.log(request) // 输出request是一个函数 ƒ wrap()


// 获取spu列表数据
export const reqSpuList = (page,limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: `get`,
    params: { category3Id }
})


// 获取spu信息
export const reqSpuInfo = (spuId)=> request({
    url:`/admin/product/getSpuById/${spuId}`,
    method:'get'

})
// 获取品牌的信息
export const reqTradeMarkList =()=>request({
    url:"/admin/product/baseTrademark/getTrademarkList",
    method:'get'
})

// 获取spu图片
export const reqSpuImageList = (spuId)=>request({
    url:`/admin/product/spuImageList/${spuId}`,
    method:'get'
})

// 平台的全部销售属性

export const reqBaseSaleAttrList =()=> request({
    url:'/admin/product/baseSaleAttrList',
    method:'get'
})

// 修改|添加spu 
export const reqAddOrUpdateSpu =(spuInfo)=>{
    if(spuInfo.id){
        return request({
            url:"/admin/product/updateSpuInfo",
            method:"post",
            data:spuInfo
        })
    }else{
        return request({
            url:"/admin/product/saveSpuInfo",
            method:"post",
            data:spuInfo
        })
    }
}

//删除spu 

export const reqDeleteSpu =(spuId)=>request({
    url:`/admin/product/deleteSpu/${spuId}`,
    method:'delete'
})




// 获取图片
export const reqSkuImageList =(spuId)=>request({
    url:`/admin/product/spuImageList/${spuId}`,
    method:'get'
})
//获取销售属性的数据
export const reqSpuSaleAttrList=(spuId)=>request({
    url:`/admin/product/spuSaleAttrList/${spuId}`,
    method:'get'
})
//获取平台属性的数据
export const reqAttrInfoList=(category1Id, category2Id,category3Id)=>request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})

// 添加sku
export const reqAddSku=(skuInfo)=>request({
    url:"/admin/product/saveSkuInfo",
    method:"post",
    data:skuInfo
})

// 获取sku列表数据的接口
export const reqSkuList=(spuId)=>request({
    url:`/admin/product/findBySpuId/${spuId}`,
    method:'get'
})