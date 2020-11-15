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
RadioGroup,
Container,
Menu,
Aside,
Submenu,
MenuItem,
MenuItemGroup,
Main
} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Steps)
Vue.use(Step)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Aside)
Vue.use(MenuItemGroup)
Vue.use(Main)

//全局挂载
Vue.prototype.$message = Message