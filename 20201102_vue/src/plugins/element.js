import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';

import 
{
Form,
FormItem,
Input,
Button,
Message,
Steps,
Step,
Radio,
RadioGroup
} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Steps)
Vue.use(Step)
Vue.use(RadioGroup)
Vue.use(Radio)

//全局挂载
Vue.prototype.$message = Message