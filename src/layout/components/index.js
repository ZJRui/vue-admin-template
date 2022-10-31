/**
 * 例如 : export { default as MiSwitch } from './Switch.vue' 从’./Switch.vue’ 中导入它的默认导出,重命名为 MiSwitch 再重新导出

`export { default as MiSwitch } from './Switch.vue'

等同于  :
import MiSwitch  from './Switch.vue'
export  { MiSwitch }
 */
export { default as Navbar } from './Navbar'
export { default as Sidebar } from './Sidebar'
export { default as AppMain } from './AppMain'
