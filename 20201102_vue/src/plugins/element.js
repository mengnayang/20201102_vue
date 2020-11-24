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
Main,
Breadcrumb,
BreadcrumbItem,
Card,
Row,
Col,
Select,
Option,
Table,
TableColumn,
Dialog,
DatePicker,
Pagination,
Tooltip,
MessageBox
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
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Tooltip)

//全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm