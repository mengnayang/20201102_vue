<template>
    <div class="view_stock_taking_rules_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>出入库信息</el-breadcrumb-item>
            <el-breadcrumb-item>零售出库单</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row v-show="isFirst">
                <el-col :span="2">
                    <span>订单编号</span>
                </el-col>
                <el-col :span="5">   
                    <el-input maxlength="100" v-model="selected.selectedRetailId" size="mini" placeholder="请输入查询的订单编号" clearable></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <span>收款员工</span>
                </el-col>
                <el-col :span="5">   
                    <el-select v-model="selected.selectedRetailCollectionStaffId" size="mini">
                        <el-option :key="100" :value="100" label="全部"></el-option>
                        <el-option v-for="item in staffList" :key="item.staffId" :value="item.staffId" :label="item.staffName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8" :offset="1">
                    <span>退款状态</span>
                    <el-select size="mini" v-model="selected.selectedRetailRefundStatus">
                        <el-option :key="100" :value="100" label="全部"></el-option>
                        <el-option :key="10" :value="10" label="未发生退款"></el-option>
                        <el-option :key="1" :value="1" label="已发生退款"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2" v-show="isFirst">
                    <el-button type="primary" size="mini" @click="searchRetail()">查询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" :disabled="isFirst" size="mini" @click="changeLayer()">返回上一级</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <!-- 一级 -->
            <el-table :data="isLazzy ? retailRecordList_lazzy : retailRecordList" border stripe v-show="isFirst">
                <el-table-column label="订单编号" prop="retailId" width="200" align="center"></el-table-column>
                <el-table-column label="收款员工" prop="retailCollectionStaffId"  width="180" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" :key="item.staffId">
                            <span v-if="item.staffId == scope.row.retailCollectionStaffId">{{item.staffName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="商品总价格" prop="retailTotalPrice"  width="150" align="center"></el-table-column>
                <el-table-column label="付款时间" prop="retailTime" width="160" align="center"></el-table-column>
                <el-table-column label="退款状态" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.retailRefundStatus == 0">未发生退款</span>
                        <span v-if="scope.row.retailRefundStatus == 1">已发生退款</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 二级 -->
            <el-table :data="retailGoodsList" border stripe v-show="isSecond">
                <el-table-column label="商品编号" prop="retailStockGoodsId" fixed  width="180" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="180" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="categoryName" width="120" align="center"></el-table-column>
                <el-table-column label="品牌名称" prop="goodsBrand"  width="120" align="center"></el-table-column>
                <el-table-column label="订单数量" prop="retailNum"  width="120" align="center"></el-table-column>
                <el-table-column label="价格" prop="retailPrice"  width="120" align="center"></el-table-column>
                <el-table-column label="单位" prop="unitName"  width="120" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_two" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination v-show="isFirst"
        :current-page="queryInfo1.pageIndex" :page-sizes="[queryInfo1.infoCount]" 
        :page-size="queryInfo1.infoCount" :total="queryInfo1.total"
        @current-change="currentChange1"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <el-pagination v-show="isSecond"
        :current-page="queryInfo2.pageIndex" :page-sizes="[queryInfo2.infoCount]" 
        :page-size="queryInfo2.infoCount" :total="queryInfo2.total"
        @current-change="currentChange2"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 查看商品零售信息弹框 -->
        <el-dialog title="零售商品信息" :visible.sync="lookGoodDialog" width="800px">
            <el-form>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        零售出库信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="1">
                        <el-form-item label="仓库编号：">
                            {{currentRetail.stock.stockId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="1">
                        <el-form-item label="入库编号：">
                            {{currentRetail.stock.stockExportBillId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="产品批号：">
                            {{currentRetail.stock.stockGoodsBatchNumber}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        订单信息信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="订单编号：">
                            {{currentRetail.retail.retailId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="单价：">
                            {{currentRetail.retail.retailPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="订单数量：">
                            {{currentRetail.retail.retailNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="商品总价格：">
                            {{currentRetail.retailRecord.retailTotalPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="操作职工：">
                            {{currentRetail.retailRecord.retailCollectionStaffId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="付款时间：">
                            {{currentRetail.retailRecord.retailTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="1">
                        <el-form-item label="商品图片：">
                            <img :src="'http://localhost:8080' + currentRetail.goods.goodsPicture" alt="图片" class="all_img">  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="商品编号：">
                            {{currentRetail.goods.goodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="商品名称：">
                            {{currentRetail.goods.goodsName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="品牌名称：">
                            {{currentRetail.goods.goodsBrand}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="商品类别：">
                            {{currentRetail.category.categoryName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="产品规格：">
                            {{currentRetail.goods.goodsSpecifications}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="品牌名称：">
                            {{currentRetail.goods.goodsBrand}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="lookGoodDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'RetailSaleDeleveryList',
        data() {
            return {
                //查询零售单的先决条件
                // 一层
                queryInfo1:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                // 二层
                queryInfo2:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //功能列表
                functionList:[],
                //一层功能列表
                functionList_one:[],
                //二层功能按钮
                functionList_two:[],
                //零售单所有的列表
                retailRecordList:[],
                //零售表某下记录下的商品信息
                retailGoodsList:[],
                //员工列表
                staffList:[],
                //渲染按钮
                isDraw:false,
                //查看商品详情
                lookDialog:false,
                //一层列表是否显示
                isFirst:true,
                //二层列表是否显示
                isSecond:false,
                //当前的储存的零售详情
                currentRetail:{
                    retail:'',
                    retailRecord:'',
                    stock:'',
                    staff:'',
                    goods:'',
                    category:'',
                    unit:''
                },
                // 查询条件
                selected:{
                    selectedRetailRefundStatus:'',
                    selectedRetailCollectionStaffId:'',
                    selectedRetailId:''
                },
                // 是否模糊查询
                isLazzy:false,
                // 模糊查询列表
                retailRecordList_lazzy:[],
                // 二层存储
                retailGoodsList:[],
                // 存储第一层的信息
                currentRowInfo:'',
                lookGoodDialog:false
            }
        },
        created() {
            this.getRetailList(),
            this.selected.selectedRetailCollectionStaffId = 100,
            this.selected.selectedRetailRefundStatus = 100
        },
        methods:{
            //获取部分采购入库单
            getRetailList() {
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                let data = {
                    pageIndex: this.queryInfo1.pageIndex-1,
                    pageSize: this.queryInfo1.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/retaildeliverylist',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.functionList = res.data.functionList
                        this.queryInfo1.total = res.data.recordSum
                        this.retailRecordList = res.data.retailRecordList
                        this.staffList = res.data.staffList
                        this.drawBtn()
                        this.retailRecordList.map((item) =>{
                            let date = new Date(item.retailTime)
                            item.retailTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        })
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            // 模糊查询
            searchRetail() {
                this.isLazzy = true
                let temp = this.selected.selectedRetailRefundStatus
                if (this.selected.selectedRetailRefundStatus == "" || this.selected.selectedRetailRefundStatus == 100) {
                    temp = null
                }
                if (this.selected.selectedRetailRefundStatus == 10) {
                    temp = 0
                }
                this.selected.selectedRetailId = this.selected.selectedRetailId == "" ? null : this.selected.selectedRetailId
                this.selected.selectedRetailCollectionStaffId = this.selected.selectedRetailCollectionStaffId == 100 ? null : this.selected.selectedRetailCollectionStaffId
                this.selected.selectedRetailCollectionStaffId = this.selected.selectedRetailCollectionStaffId == "" ? null : this.selected.selectedRetailCollectionStaffId

                let retailRecord = {
                    retailId:this.selected.selectedRetailId,
                    retailCollectionStaffId:this.selected.selectedRetailCollectionStaffId,
                    retailRefundStatus:temp
                }
                let data = {
                    staffId : window.sessionStorage.getItem('staffId'),
                    pageIndex:this.queryInfo1.pageIndex-1,
                    pageSize:this.queryInfo1.infoCount,
                    retailRecord:JSON.stringify(retailRecord)
                }
                this.$axios.post('/retaildeliverylist/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.retailRecordList_lazzy = res.data.retailRecordList
                        this.queryInfo1.total = res.data.recordSum

                        this.retailRecordList_lazzy.map((item) =>{
                            let date = new Date(item.retailTime)
                            item.retailTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        })

                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //根据指定页码获取相应的库存信息
            // 一层
            currentChange1(currentPage) {
                this.queryInfo1.pageIndex = currentPage
                if (this.isLazzy) {
                    this.searchRetail()
                } else {
                    this.getRetailList()
                }
            },
            //根据指定页码获取相应的库存信息
            //二层
            currentChange2(currentPage) {
                this.queryInfo2.pageIndex = currentPage
                this.lookAllInfo(this.currentRowInfo)
            },
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 1) {
                            this.$set(this.functionList[i],"btnType","primary")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                            this.functionList_one.push(this.functionList[i])
                        } else if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","primary")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                            this.functionList_two.push(this.functionList[i])
                        } 
                        this.isDraw = true
                    }
                }
            },
            //转换层级
            changeLayer() {
                this.isFirst = true,
                this.isSecond = false,
                this.getRetailList()
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionWeight) {
                if (functionWeight == 1) {
                    this.lookAllInfo(rowInfo)
                } else if (functionWeight == 2) {
                    this.lookDialogInfo(rowInfo)
                }
            },
            //查看所有商品
            lookAllInfo(rowInfo) {
                this.currentRowInfo = rowInfo
                let data = {
                    retailId:rowInfo.retailId
                }
                this.$axios.post('/retaildeliverylist/retaildetails', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.isFirst = false
                        this.isSecond = true
                        this.retailGoodsList = res.data.retailGoodsList
                        this.queryInfo2.total = res.data.recordSum
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) =>  {
                    this.$message.error(err.message)
                })
            },
            //查看商品详情
            lookDialogInfo(rowInfo) {
                console.log(rowInfo)
                this.lookGoodDialog = true
                let data = {
                    retailId:this.currentRowInfo.retailId,
                    retailStockGoodsId:rowInfo.retailStockGoodsId,
                }
                this.$axios.post('/retaildeliverylist/retailgoodsdetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken : window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        if (res.data.success) {
                            this.currentRetail.retail = res.data.retail,
                            this.currentRetail.retailRecord = res.data.retailRecord
                            this.currentRetail.stock = res.data.stock
                            this.currentRetail.staff = res.data.staff   
                            this.currentRetail.goods = res.data.goods
                            this.currentRetail.category = res.data.category
                            this.currentRetail.unit = res.data.unit
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
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
.title{
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 10px;
}
.all_img{
    width: 100px;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>