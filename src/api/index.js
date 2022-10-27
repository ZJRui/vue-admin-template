/* eslint-disable indent */
// 将四个模块请求的接口统一暴漏,因为 product下面的四个js文件是我们自己写的，所以我们这里
// 通过index文件将这四个文件中的方法对外暴漏。 而同级别目录下的user.js table.js是原来的js文件，对于原来的js文件，项目本身会使用直接对table。js或者user.js引用的方式来使用，而不是通过index.js来引用

import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'

export default {
    attr,
    trademark,
    spu,
    sku
}
