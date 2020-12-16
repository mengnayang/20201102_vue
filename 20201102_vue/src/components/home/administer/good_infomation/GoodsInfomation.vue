<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息维护</el-breadcrumb-item>
            <el-breadcrumb-item>商品信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-table :data="goodsList" border>
                <el-table-column label="商品图片" prop="goodsPicture" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="goodsId" width="150px" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="150px" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategoryId" align="center"></el-table-column>
                <el-table-column label="品牌名称" prop="goodsBrand" align="center"></el-table-column>
                <el-table-column label="商品规格" prop="goodsSpecifications" align="center"></el-table-column>
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
        <!-- 修改商品维护信息 -->
        <el-dialog title="商品维护-修改" :visible.sync="editProtectGoodDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="商品编号:">
                            <el-input v-model="currentGood.goodsId" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品名称:">
                            <el-input v-model="currentGood.goodsName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="品牌名称:">
                            <el-input v-model="currentGood.goodsBrand" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品类别:">
                            <template slot-scope="scope">
                                 <el-select v-model="currentGood.goodsCategoryId">
                                    <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId" ></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="规格:">
                            <el-input v-model="currentGood.goodsSpecifications" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品图片">
                            <img src="" alt="商品图片">
                        </el-form-item>
                    </el-col>
                </el-row>    
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="success" size="small" @click="editProtectGood()">修改</el-button>
            <el-button type="primary" size="small" @click="editProtectGoodDialog = false">取消</el-button>                </span>
        </el-dialog>
        <!-- 新增商品维护信息 -->
        <el-dialog title="商品维护-新增" :visible.sync="addProtectGoodDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="商品编号:">
                            <el-input v-model="currentGood.goodsId" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品名称:">
                            <el-input v-model="currentGood.goodsName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="品牌名称:">
                            <el-input v-model="currentGood.goodsBrand" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品类别:">
                            <template slot-scope="scope">
                                 <el-select v-model="currentGood.goodsCategoryId">
                                    <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId" ></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="规格:">
                            <el-input v-model="currentGood.goodsSpecifications" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="商品图片">
                            <img src="" alt="商品图片">
                        </el-form-item>
                    </el-col>
                </el-row>    
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="danger" size="small" @click="addProtectGood()">新增</el-button>
            <el-button type="primary" size="small" @click="addProtectGoodDialog = false">取消</el-button>                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'GoodsInfomation',
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
                // 商品列表
                goodsList:[],
                // 类别列表
                categoryList:[],
                // 功能列表
                functionList:[],
                //是否已经渲染功能按钮
                isDraw:false,
                // 修改商品维护弹框
                editProtectGoodDialog:false,
                // 添加商品维护弹框
                addProtectGoodDialog:false,
                // 存储当前新增的商品信息
                currentGood:{
                    goodsId:"",
                    goodsName:"",
                    goodsCategoryId:"",
                    goodsBrand:"",
                    goodsSpecifications:"",
                    goodsPicture:""
                }
            }
        },
        created() {
            this.getProtectGoods()
        },
        methods:{
            getProtectGoods() {
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
                this.$axios.post('/goodsinformation',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.goodsList = res.data.goodsList
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
                this.getProtectGoods()
            },
            //获取按钮功能
            getButtonStatus(good,functionWeight) {
                if (functionWeight == 1) {
                    this.editProtectGoodInfo(good)
                } else if (functionWeight == 2) {
                    // 防止点击修改后点击这里，造成数据混乱
                    this.currentGood = {}
                    this.addProtectGoodDialog = true
                } 
            },
            // 商品信息维护-增加
            addProtectGood() {
                let goods = {
                    goodsId:this.currentGood.goodsId,
                    goodsName:this.currentGood.goodsName,
                    goodsCategoryId:this.currentGood.goodsCategoryId,
                    goodsBrand:this.currentGood.goodsBrand,
                    goodsSpecifications:this.currentGood.goodsSpecifications,
                    goodsPicture:""
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    goods:JSON.stringify(goods)
                }
                this.$axios.post('/goodsinformation/add',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.addProtectGoodDialog = false
                        this.getProtectGoods()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                
            },
            // 商品信息维护弹框-修改
            editProtectGoodInfo(good) {
                this.currentGood.goodsId = good.goodsId
                this.currentGood.goodsName = good.goodsName
                this.currentGood.goodsCategoryId = good.goodsCategoryId
                this.currentGood.goodsBrand = good.goodsBrand
                this.currentGood.goodsSpecifications = good.goodsSpecifications
                this.currentGood.goodsPicture = good.goodsPicture
                this.editProtectGoodDialog = true
            },
            // 商品信息维护-修改
            editProtectGood() {
                let goods = {
                    goodsId:this.currentGood.goodsId,
                    goodsName:this.currentGood.goodsName,
                    goodsCategoryId:this.currentGood.goodsCategoryId,
                    goodsBrand:this.currentGood.goodsBrand,
                    goodsSpecifications:this.currentGood.goodsSpecifications,
                    goodsPicture:""
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    goods:JSON.stringify(goods)
                }
                this.$axios.post('/goodsinformation/modify', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.editProtectGoodDialog = false
                        this.getProtectGoods()
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