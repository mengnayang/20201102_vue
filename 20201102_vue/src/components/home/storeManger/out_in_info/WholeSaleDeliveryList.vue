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
            <el-row>
                <el-col :span="2">
                    <span>出库编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedDeliveryId" size="mini"></el-input>
                </el-col>
                <el-col :span="7" :offset="1">
                    <span>出库状态:</span>
                    <el-select size="mini" v-model="selected.selectedDeliveryStatus">
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option :key="0" :value="0" label="营业员初次发起"></el-option>
                        <el-option :key="1" :value="1" label="库房管理员确认出库"></el-option>
                        <el-option :key="-1" :value="-1" label="库房管理员驳回出库单"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7" :offset="1">
                    <span>结账状态:</span>
                    <el-select size="mini" v-model="selected.selectedDeliveryCheckOutStatus">
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option :key="0" :value="0" label="未结账"></el-option>
                        <el-option :key="1" :value="1" label="已结账"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span>退款状态：</span>
                    <el-select size="mini" v-model="selected.selectedDeliveryRefundStatus">
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option :key="0" :value="0" label="未发生退款"></el-option>
                        <el-option :key="1" :value="1" label="已发生退款"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" @click="searchDelivery()">查询</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" :disabled="isFirst" size="mini" @click="changeLayer()">返回上一级</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <!-- 一级 -->
            <el-table :data="isLazzy ? deliveryRecordList_lazzy : deliveryRecordList" border stripe v-show="isFirst">
                <el-table-column label="出库编号" prop="deliveryId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="出库状态"  width="180" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deliveryStatus == 0">营业员初次发起</span>
                        <span v-else-if="scope.row.deliveryStatus == 1">库房管理员确认出库</span>
                        <span v-else>库房管理员驳回出库单</span>
                    </template>
                </el-table-column>
                <el-table-column label="入库时间" prop="deliveryCreateDate" width="120" align="center"></el-table-column>
                <el-table-column label="总价格" prop="deliveryTotalPrice" width="120" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="deliveryPaid" width="120" align="center"></el-table-column>
                <el-table-column label="结账状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deliveryCheckOutStatus == 0">未付款</span>
                        <span v-else>已付款</span>
                    </template>
                </el-table-column>
                <el-table-column label="退款状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deliveryRefundStatus == 0">未发生退款</span>
                        <span v-else>已发生退款</span>
                    </template>
                </el-table-column>
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
                <el-table-column label="商品图片" prop="goodsPicture" fixed width="100" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="deliveryStockGoodsId" fixed width="160" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" fixed width="150" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="categoryName" width="100" align="center"></el-table-column>
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
        <el-dialog title="批发出库单信息" :visible.sync="lookDialog" width="600px">
            <el-form>
                <el-row>
                    <el-col :span="11" :offset="9" class="title">
                        出库信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出库编号：">{{currentInfo.delivery.deliveryId}}</el-form-item> 
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品批号：">{{currentInfo.delivery.deliveryId}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="批发单价：">{{currentInfo.delivery.deliveryPrice}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出库数量：">{{currentInfo.delivery.deliveryNum}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已付款项：">{{currentInfo.deliveryRecord.deliveryPaid}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="出库状态：">
                            <template>
                                <span v-if="currentInfo.deliveryRecord.deliveryStatus == 0">营业员初次发起</span>
                                <span v-else-if="currentInfo.deliveryRecord.deliveryStatus == 1">库房管理员确认出库</span>
                                <span v-else>库房管理员驳回出库单</span>
                            </template>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发起职工：">{{staffMap[currentInfo.deliveryRecord.deliveryLaunchedStaffId]}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理职工：">{{staffMap[currentInfo.deliveryRecord.deliveryHandleStaffId]}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总价格：">{{currentInfo.deliveryRecord.deliveryTotalPrice}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结账状态：">
                            <template>
                                <span v-if="currentInfo.deliveryRecord.deliveryCheckOutStatus == 0">未付款</span>
                                <span v-else>已付款</span>
                            </template>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="退款状态：">
                            <template>
                                <span v-if="currentInfo.deliveryRecord.deliveryRefundStatus == 0">未发生退款</span>
                                <span v-else>已发生退款</span>
                            </template>    
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="创建时间：">{{currentInfo.deliveryRecord.deliveryCreateDate}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品编号:">
                            {{currentInfo.goods.goodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">
                            {{currentInfo.goods.goodsName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品类别：">
                            {{currentInfo.category.categoryName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称：">
                            {{currentInfo.goods.goodsBrand}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品规格：">
                            {{currentInfo.goods.goodsSpecifications}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品单位：">
                            <span>{{currentInfo.unit.unitName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生产日期：">
                            {{currentInfo.stock.stockGoodsProductionDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期：">
                            {{currentInfo.stock.stockGoodsShelfLife}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品图片：">
                            <img :src="currentInfo.goods.goodsPicture" alt="图片">
                        </el-form-item>
                    </el-col>
                </el-row>
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
                //员工列表
                staffMap:[],
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
                isSecond:false,
                //当前的出库编号
                deliveryId:'',
                currentInfo:{
                    delivery:'',
                    category:'',
                    deliveryRecord:'',
                    goods:'',
                    staff:'',
                    stock:'',
                    unit:''
                },
                // 查询信息
                selected:{
                    selectedDeliveryCheckOutStatus:'',
                    selectedDeliveryStatus:'',
                    selectedDeliveryRefundStatus:'',
                    selectedDeliveryId:''
                },
                // 是否模糊查询
                isLazzy: false,
                // 模糊查询的列表
                deliveryRecordList_lazzy:[]
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
                    secondaryMenuId: this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId')
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
                        this.queryInfo.total = res.data.recordSum
                        this.staffMap = res.data.staffMap
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
            searchDelivery(){
                this.isLazzy = true
                this.selected.selectedDeliveryId = this.selected.selectedDeliveryId == "" ? null : this.selected.selectedDeliveryId
                this.selected.selectedDeliveryCheckOutStatus = this.selected.selectedDeliveryCheckOutStatus == "" ? null : this.selected.selectedDeliveryCheckOutStatus
                this.selected.selectedDeliveryCheckOutStatus = this.selected.selectedDeliveryCheckOutStatus == 1000 ? null : this.selected.selectedDeliveryCheckOutStatus
                this.selected.selectedDeliveryStatus = this.selected.selectedDeliveryStatus == "" ? null : this.selected.selectedDeliveryStatus
                this.selected.selectedDeliveryRefundStatus = this.selected.selectedDeliveryRefundStatus == "" ? null : this.selected.selectedDeliveryRefundStatus

                let deliveryRecord = {
                    deliveryId:this.selected.selectedDeliveryId,
                    deliveryStatus:this.selected.selectedDeliveryStatus,
                    deliveryCheckOutStatus:this.selected.selectedDeliveryCheckOutStatus,
                    deliveryRefundStatus:this.selected.selectedDeliveryRefundStatus
                }
                let data = {
                    deliveryRecord :JSON.stringify(deliveryRecord),
                    pageSize:this.queryInfo.infoCount,
                    pageIndex:this.queryInfo.pageIndex-1,
                    staffId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/wholesaledeliverylist/findByConditions', this.$qs.stringify(data), {
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.deliveryRecordList_lazzy = res.data.deliveryRecordList
                        this.queryInfo.total = res.data.recordSum

                        this.deliveryRecordList_lazzy.map((item) => {
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
            //查看所有商品
            lookAllInfo(rowInfo) {
                this.deliveryId = rowInfo.deliveryId
                let data = {
                    deliveryId:this.deliveryId
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
            //查看商品详情
            lookDialogInfo(rowInfo) {
                let data = {
                    deliveryId: this.deliveryId,
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
                            this.currentInfo.delivery = res.data.delivery,
                            this.currentInfo.category = res.data.category,
                            this.currentInfo.deliveryRecord = res.data.deliveryRecord,
                            this.currentInfo.goods = res.data.goods,
                            this.currentInfo.staff = res.data.staff,
                            this.currentInfo.stock = res.data.stock,
                            this.currentInfo.unit = res.data.unit,
                            this.lookDialog = true

                            
                            let data = new Date(this.currentInfo.stock.stockGoodsProductionDate)
                            this.currentInfo.stock.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                            data = new Date(this.currentInfo.deliveryRecord.deliveryCreateDate)
                            this.currentInfo.deliveryRecord.deliveryCreateDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
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
}
.el-button{
    margin: 0 5px;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>