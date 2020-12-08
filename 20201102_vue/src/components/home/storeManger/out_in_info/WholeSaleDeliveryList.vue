<template>
    <div class="view_stock_taking_rules_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>出入库信息</el-breadcrumb-item>
            <el-breadcrumb-item>批发出库单</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <!-- <el-row :gutter="10">
                <el-col :span="8">
                    <span>出库编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>订单发起人</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>状态</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row> -->
            <el-button type="primary" :disabled="isFirst" size="small" @click="changeLayer()">返回上一级</el-button>
            <!-- 表单区域 -->
            <!-- 一级 -->
            <el-table :data="deliveryRecordList" border stripe v-show="isFirst">
                <el-table-column label="出库编号" prop="deliveryId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="出库状态" prop="deliveryStatus"  width="100" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="deliveryCreateDate" width="120" align="center"></el-table-column>
                <el-table-column label="总价格" prop="deliveryTotalPrice" width="120" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="deliveryPaid" width="120" align="center"></el-table-column>
                <el-table-column label="结账状态" prop="deliveryCheckOutStatus" width="100" align="center"></el-table-column>
                <el-table-column label="退款状态" prop="deliveryRefundStatus" width="100" align="center"></el-table-column>
                <el-table-column label="发起职工" prop="deliveryLaunchedStaffId"  width="100" align="center"></el-table-column>
                <el-table-column label="处理职工" prop="deliveryHandleStaffId" width="100" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="140" align="center">
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
            <el-table :data="deliveryGoodsList" border stripe v-show="isSecond">
                <el-table-column label="商品图片" prop="goodsPicture" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="deliveryStockGoodsId" fixed width="100" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="100" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategoryIName" width="100" align="center"></el-table-column>
                <el-table-column label="品牌名称" prop="goodsBrand" width="100" align="center"></el-table-column>
                <el-table-column label="出库数量" prop="deliveryNum" width="80" align="center"></el-table-column>
                <el-table-column label="批发单价" prop="deliveryPrice" width="80" align="center"></el-table-column>
                <el-table-column label="销售单位" prop="unitName"  width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="100" align="center">
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
        <el-pagination
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 查看商品详细信息弹框 -->
        <el-dialog title="批发出库单信息" :visible.sync="lookDialog" width="500px">
            <el-form>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="lookDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'WholeSaleDeleveryList',
        data() {
            return {
                //查询批发单的先决条件
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:4
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
                //批发出库单总列表
                deliveryRecordList:[],
                //该出库单的详细商品信息
                deliveryGoodsList:[],
                //渲染按钮
                isDraw:false,
                //查看商品详情
                lookDialog:false,
                //一层列表是否显示
                isFirst:true,
                //二层列表是否显示
                isSecond:false
            }
        },
        created() {
            this.getWholeSaleList()
        },
        methods:{
            //获取部分采购入库单
            getWholeSaleList() {
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                let data = {
                    pageIndex: this.queryInfo.pageIndex-1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId
                }
                this.$axios.post('/wholesaledeliverylist',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.functionList = res.data.functionList
                        this.deliveryRecordList = res.data.deliveryRecordList
                        this.queryInfo.infoCount = res.data.recordSum
                        this.drawBtn()

                        this.deliveryRecordList.map((item) => {
                            let data = new Date(item.deliveryCreateDate)
                            item.deliveryCreateDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
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
            currentChange(currentPage) {
                this.queryInfo.pageIndex(currentPage)
                this.getPurchaseList()
            },
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 1) {
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_confirm")
                            this.functionList_one.push(this.functionList[i])
                        } else if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","primary")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                            this.functionList_one.push(this.functionList[i])
                        } else if (this.functionList[i].functionWeight == 3) {
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
                this.isSecond = false
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionWeight) {
                if (functionWeight == 2) {
                    this.lookAllInfo(rowInfo)
                } else if (functionWeight == 1) {
                    this.confirmIntoStore(rowInfo)
                } else if (functionWeight == 3) {
                    this.lookDialogInfo(rowInfo)
                } 
            },
            //查看所有商品
            lookAllInfo(rowInfo) {
                let data = {
                    deliveryId:rowInfo.deliveryId
                }
                this.$axios.post('/wholesaledeliverylist/warehousingdetails', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.isFirst = false
                        this.isSecond = true
                        this.deliveryGoodsList = res.data.deliveryGoodsList
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) =>  {
                    this.$message.error(err.message)
                })
            },
            //确认入库
            confirmIntoStore(rowInfo) {
                let data = {
                    staffId : window.sessionStorage.getItem('staffId'),
                    deliveryId: rowInfo.deliveryId
                }
                this.$axios.post('/wholesaledeliverylist/confirmwarehousing', this.$qs.stringify(data), {
                    headers:{
                        staffToken : window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('入库成功')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //查看商品详情
            lookDialogInfo(rowInfo) {
                let data = {
                    deliveryId: rowInfo.deliveryId,
                    deliveryStockGoodsId:rowInfo.deliveryStockGoodsId
                }
                this.$axios.post('/wholesaledeliverylist/warehousinggoodsdetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken : window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        if (res.data.success) {
                            console.log(res.data)
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
.el-button{
    margin: 0 5px;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>