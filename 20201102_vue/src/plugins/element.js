import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';

import 
{
Form,
FormItem,
Input,
Button,
Message
} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

//全局挂载
Vue.prototype.$message = Message