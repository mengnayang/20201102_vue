<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息维护</el-breadcrumb-item>
            <el-breadcrumb-item>类别信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-table :data="categoryList" border>
                <el-table-column label="类别编号" prop="categoryId" width="180px" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="categoryName" width="180px" align="center"></el-table-column>
                <el-table-column label="盘点职工" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" :key="item.staffId">
                            <span v-if="scope.row.stocktakingStaffId == item.staffId">{{item.staffName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="职工状态" prop="staffStatus" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" :key="item.staffId">
                            <span v-if="scope.row.stocktakingStaffId == item.staffId && item.staffStatus == 1000">正常</span>
                            <span v-else-if="scope.row.stocktakingStaffId == item.staffId && item.staffStatus == 1001">刚注册</span>
                            <span v-else-if="scope.row.stocktakingStaffId == item.staffId && item.staffStatus == -1">离职</span>
                            <span v-else-if="scope.row.stocktakingStaffId == item.staffId && item.staffStatus == 0">无权限</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" :page-size="queryInfo.infoCount" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total">
        </el-pagination>
        <!-- 修改商品类别维护信息 -->
        <el-dialog title="商品类别维护-修改" :visible.sync="editProtectCategoryDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="17" :offset="1">
                        <el-form-item label="商品类别:">
                            <el-input v-model="currentCategory.categoryName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" :offset="1">
                        <el-form-item label="盘点职工:">
                            <template>
                                <el-select v-model="currentCategory.staffId">
                                    <el-option v-for="item in staffList" :key="item.staffId" :value="item.staffId" :label="item.staffName"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="success" size="small" @click="editProtectCategory()">修改</el-button>
            <el-button type="primary" size="small" @click="editProtectCategoryDialog = false">取消</el-button>                </span>
        </el-dialog>
        <!-- 新增商品类别维护信息 -->
        <el-dialog title="商品类别维护-新增" :visible.sync="addProtectCategoryDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="14" :offset="3">
                        <el-form-item label="商品类别:">
                            <el-input v-model="currentCategory.categoryName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" :offset="3">
                        <el-form-item label="盘点职工:">
                            <template>
                                <el-select v-model="currentCategory.staffId">
                                    <el-option v-for="item in staffList" :key="item.staffId" :value="item.staffId" :label="item.staffName"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>    
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="danger" size="small" @click="addProtectCategory()">新增</el-button>
            <el-button type="primary" size="small" @click="addProtectCategoryDialog = false">取消</el-button>                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'CategoryInfomation',
        data() {
            return{
                //请求商品维护列表的先决条件
                queryInfo:{
                    pageIndex:1,
                    total:0,
                    infoCount:4
                },
                //二级菜单列表
                secondaryMenuList:[],
                secondaryMenuId:'',
                // 员工列表
                staffList:[],
                // 类别列表
                categoryList:[],
                // 功能列表
                functionList:[],
                //是否已经渲染功能按钮
                isDraw:false,
                // 修改商品维护弹框
                editProtectCategoryDialog:false,
                // 添加商品维护弹框
                addProtectCategoryDialog:false,
                // 存储当前新增的商品信息
                currentCategory:{
                    categorysId:"",
                    categoryName:"",
                    staffId:""
                }
            }
        },
        created() {
            this.getProtectCategory()
        },
        methods:{
            getProtectCategory() {
                this.isDraw = false

                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    secondaryMenuId:this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId'),
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount
                }
                this.$axios.post('/categoryinformation',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.staffList = res.data.staffList
                        this.categoryList = res.data.categoryList
                        this.functionList = res.data.functionList
                        this.queryInfo.total = res.data.recordSum
                        this.drawBtn()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //动态渲染按钮
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 1) {
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                        } else if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","danger")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_add")
                        } 
                        this.isDraw = true
                    }
                }
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getProtectCategory()
            },
            //获取按钮功能
            getButtonStatus(category,functionWeight) {
                if (functionWeight == 1) {
                    this.editProtectCategoryInfo(category)
                } else if (functionWeight == 2) {
                    // 防止点击修改后点击这里，造成数据混乱
                    this.currentCategory = {}
                    this.addProtectCategoryDialog = true
                } 
            },
            // 商品类别信息维护-增加
            addProtectCategory() {
                let category = {
                    categoryId:null,
                    categoryName:this.currentCategory.categoryName,
                    stocktakingStaffId:this.currentCategory.staffId
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    category:JSON.stringify(category)
                }
                this.$axios.post('/categoryinformation/add',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.addProtectCategoryDialog = false
                        this.getProtectCategory()
                        this.$message.success('类别信息添加成功')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                
            },
            // 商品信息类别维护弹框-修改
            editProtectCategoryInfo(category) {
                this.currentCategory.categoryId = category.categoryId
                this.currentCategory.categoryName = category.categoryName
                this.currentCategory.staffId = category.stocktakingStaffId
                this.editProtectCategoryDialog = true
            },
            // 商品类别信息维护-修改
            editProtectCategory() {
                let category = {
                    categoryId:this.currentCategory.categoryId,
                    categoryName:this.currentCategory.categoryName,
                    stocktakingStaffId:this.currentCategory.staffId
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    category:JSON.stringify(category)
                }
                this.$axios.post('/categoryinformation/modify', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.editProtectCategoryDialog = false
                        this.getProtectCategory()
                        this.$message.success('类别信息更新成功')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    box-shadow: 0 1px 1px rgba(0,0, 0, 0.15);
    .el-row{
        margin-bottom: 10px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
.el-button-group{
    .el-button{
        margin: 0 3px;
    }
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>