<template>
    <div class="view_stock_taking_rules_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>出入库信息</el-breadcrumb-item>
            <el-breadcrumb-item>采购入库单</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row>
                <el-col :span="2">
                    <span>入库编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input maxlength="100" v-model="selected.selectedExportBillId" size="mini" placeholder="请输入查询的入库编号" clearable></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <span>订单编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input maxlength="100" v-model="selected.selectedExportBillCouponId" size="mini" placeholder="请输入查询的订单编号" clearable></el-input>
                </el-col>
                <el-col :span="8" :offset="1">
                    <span>入库状态</span>
                    <el-select size="mini" v-model="selected.selectedExportBillStatus">
                        <el-option :key="100" :value="100" label="全部"></el-option>
                        <el-option :key="10" :value="10" label="刚生成入库单"></el-option>
                        <el-option :key="1" :value="1" label="库房管理员已完善信息"></el-option>
                        <el-option :key="2" :value="2" label="职工已检查通过"></el-option>
                        <el-option :key="-2" :value="-2" label="职工已检查未通过"></el-option>
                        <el-option :key="3" :value="3" label="库房管理员已入库"></el-option>
                        <el-option :key="-1" :value="-1" label="库房管理员审核不通过"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" size="mini" @click="searchExportBill()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="isLazzy ? exportBillList_lazzy : exportBillList" border stripe>
                <el-table-column label="入库编号" prop="exportBillId" fixed width="250" align="center"></el-table-column>
                <el-table-column label="订单编号" prop="exportBillCouponId" width="100" align="center"></el-table-column>
                <el-table-column label="供货商编号" prop="exportBillSupplierId"  width="100" align="center"></el-table-column>
                <el-table-column label="产品批号" prop="exportBillGoodsBatchNumber"  width="100" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="exportBillProductionDate" width="100" align="center"></el-table-column>
                <el-table-column label="保质期" prop="exportBillShelfLife" width="80" align="center"></el-table-column>
                <el-table-column label="供货价格" prop="exportBillPrice" width="120" align="center"></el-table-column>
                <el-table-column label="入库状态" width="180" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.exportBillStatus == 1000">全部</span>
                        <span v-else-if="scope.row.exportBillStatus == 0">刚生成入库单</span>
                        <span v-else-if="scope.row.exportBillStatus == 1">库房管理员已完善信息</span>
                        <span v-else-if="scope.row.exportBillStatus == 2">职工已检查通过</span>
                        <span v-else-if="scope.row.exportBillStatus == -2">职工已检查未通过</span>
                        <span v-else-if="scope.row.exportBillStatus == 3">库房管理员已入库</span>
                        <span v-else-if="scope.row.exportBillStatus == -1">库房管理员审核不通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="已付款项" prop="exportBillPaid" width="80" align="center"></el-table-column>
                <el-table-column label="入库日期" prop="exportBillTime" width="100" align="center"></el-table-column>
                <el-table-column label="确认职工" prop="exportConfirmStaffId" width="80" align="center"></el-table-column>
                <el-table-column label="提交职工" prop="exportSubmitStaffId" width="80" align="center"></el-table-column>
                <el-table-column label="备注" prop="exportBillMark" width="150" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="260" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
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
        <!-- 采购入库单的信息弹框 -->
        <el-dialog title="采购入库单" :visible.sync="lookDialog" width="800px">
            <el-form>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        入库信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="2">
                        <el-form-item label="入库日期：">{{exportBill.exportBillTime}}</el-form-item> 
                    </el-col>
                    <el-col :span="14" :offset="1">
                        <el-form-item label="入库编号：">{{exportBill.exportBillId}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="2">
                        <el-form-item label="已付款项/元：">{{exportBill.exportBillPaid}}</el-form-item> 
                    </el-col>
                    <el-col :span="14" :offset="1">
                        <el-form-item label="入库状态：">
                            <template>
                                <span v-if="exportBill.exportBillStatus == 0">刚生成入库单</span>
                                <span v-else-if="exportBill.exportBillStatus == 1">库房管理员已完善信息</span>
                                <span v-else-if="exportBill.exportBillStatus == 2">职工已检查通过</span>
                                <span v-else-if="exportBill.exportBillStatus == -2">职工已检查未通过</span>
                                <span v-else-if="exportBill.exportBillStatus == 3">库房管理员已入库</span>
                                <span v-else>库房管理员审核不通过</span>
                            </template>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="2">
                        <el-form-item label="确认职工：">{{exportBill.exportConfirmStaffId}}</el-form-item> 
                    </el-col>
                    <el-col :span="14" :offset="1">
                        <el-form-item label="入库备注：">{{exportBill.exportBillRemark}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        订单信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单编号:">
                            {{coupon.couponGoodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单数量:">
                            {{coupon.couponNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单时间:">
                            {{coupon.couponTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单状态:">
                            <template>
                                <span v-if="coupon.couponStatus == 0">订货中</span>
                                <span v-else-if="coupon.couponStatus == 1">订货成功</span>
                                <span v-else>订货失败</span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单发起职工:">
                            {{coupon.couponStaffId}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="2">
                        <el-form-item label="商品编号:">
                            {{goods.goodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="14" :offset="1">
                        <el-form-item label="商品名称:">
                            {{goods.goodsName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" :offset="2">
                        <el-form-item label="商品类别：">
                            {{category.categoryName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="品牌名称：">
                            {{goods.goodsBrand}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-form-item label="生产日期：">
                            {{exportBill.exportBillProductionDate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品规格：">
                            {{goods.goodsSpecifications}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品单位：">
                            <span>{{unit.unitName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品图片：">
                            <img :src="$store.state.imgBaseURL + goods.goodsPicture" alt="图片" class="all_img">  
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="lookDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 修改采购入库单的信息弹框 -->
        <el-dialog title="修改采购入库单" :visible.sync="editDialog" width="800px">
            <el-form label-width="110px">
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        入库信息
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入库编号：">
                            <el-input v-model="exportBill.exportBillId" size="small" disabled></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品批号：">
                            <el-input maxlength="100" v-model="exportBill.exportBillGoodsBatchNumber" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="供货编号：">
                            <el-input maxlength="100" type="number" v-model="exportBill.exportBillSupplierId" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="入库状态：">
                            <el-select v-model="exportBill.exportBillStatus">
                                <el-option :key="0" :value="0" label="刚生成入库单"></el-option>
                                <el-option :key="1" :value="1" label="库房管理员已完善信息"></el-option>
                                <el-option :key="2" :value="2" label="职工已检查通过"></el-option>
                                <el-option :key="-2" :value="-2" label="职工已检查未通过"></el-option>
                                <el-option :key="-1" :value="-1" label="库房管理员审核不通过"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="已付款项/元：">
                            <el-input maxlength="100" type="number" v-model.number="exportBill.exportBillPaid" size="small"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7" v-show="false">
                        <el-form-item label="确认职工：">
                            <el-input maxlength="100" v-model="exportBill.exportConfirmStaffId" size="small"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="入库备注：">
                            <el-input type="textarea" maxlength="100" placeholder="暂无" v-model="exportBill.exportBillMark" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        订单信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单编号：">
                            <el-input v-model="coupon.couponGoodsId" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单数量：">
                            <el-input v-model="coupon.couponNum" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态：">
                            <el-input v-model="coupon.couponStatus" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单时间：" width="100">
                            <el-date-picker v-model="coupon.couponTime" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发起职工：">
                            <el-input v-model="coupon.couponStaffId" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品编号：">
                            <el-input v-model="goods.goodsId" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称：">
                            <el-input v-model="goods.goodsName" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品类别：">
                            <el-input v-model="category.categoryName" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称：">
                            <el-input v-model="goods.goodsBrand" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品规格：">
                            <el-input v-model="goods.goodsSpecifications" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品单位：">
                            <el-input v-model="unit.unitName" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供货价格/元：">
                            <el-input maxlength="100" type="number" v-model.number="exportBill.exportBillPrice" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期/天：">
                            <el-input maxlength="100" type="number" v-model.number="exportBill.exportBillShelfLife" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="exportBill.exportBillProductionDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="1">
                        <el-form-item label="商品图片：">
                            <img :src="$store.state.imgBaseURL + goods.goodsPicture" alt="图片" class="all_img">  
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" size="small" @click="editDialog1()">修改</el-button>
                <el-button type="primary" size="small" @click="editDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'PurchaseList',
        data() {
            return {
                //查询采购入库单的先决条件
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //采购入库单
                exportBillList:[],
                //功能列表
                functionList:[],
                // 一级功能那个列表
                functionList_one:[],
                //是否渲染按钮
                isDraw:false,
                exportBill:'',
                coupon:'',
                unit:'',
                category:'',
                goods:'',
                //查看采购入库单弹窗
                lookDialog:false,
                //修改采购入库单弹窗
                editDialog:false,
                selected:{
                    selectedExportBillId:'',
                    selectedExportBillCouponId:'',
                    selectedExportBillStatus:''
                },
                // 是否模糊查询
                isLazzy:false,
                // 模糊查询返回的数据
                exportBillList_lazzy:[]
            }
        },
        created() {
            this.getPurchaseList(),
            this.selected.selectedExportBillStatus = 100
        },
        methods:{
            //获取部分采购入库单
            getPurchaseList() {
                this.functionList_one=[]
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                this.isDraw = false
                let data = {
                    pageIndex: this.queryInfo.pageIndex-1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/purchaselist',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.functionList = res.data.functionList
                        this.exportBillList = res.data.exportBillList
                        this.queryInfo.total = res.data.recordSum
                        this.exportBillList.map((item) => {
                            if(item.exportBillProductionDate != null) {
                                let date = new Date(item.exportBillProductionDate)
                                item.exportBillProductionDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                                date = new Date(item.exportBillTime)
                                item.exportBillTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                            }
                        })
                        this.drawBtn()
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
                this.queryInfo.pageIndex = currentPage
                if (this.isLazzy) {
                    this.searchExportBill()
                } else {
                    this.getPurchaseList()
                }
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
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                            this.functionList_one.push(this.functionList[i])
                        } else if (this.functionList[i].functionWeight == 3) {
                            this.$set(this.functionList[i],"btnType","warning")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_confirm")
                            this.functionList_one.push(this.functionList[i])
                        } else if (this.functionList[i].functionWeight == 4) {
                            this.$set(this.functionList[i],"btnType","danger")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_reject")
                            this.functionList_one.push(this.functionList[i])
                        }
                        this.isDraw = true
                    }
                }
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionWeight) {
                if (functionWeight == 1) {
                    this.lookDialogInfo(rowInfo)
                } else if (functionWeight == 2) {
                    this.editDialogInfo(rowInfo)
                } else if (functionWeight == 3) {
                    this.confirmIntoStore(rowInfo)
                } else if (functionWeight == 4) {
                    this.rejectIntoStore(rowInfo)
                }
            },
            // 模糊查询采购入库单
            searchExportBill(){
                this.isLazzy = true
                let temp = this.selected.selectedExportBillStatus
                this.selected.selectedExportBillCouponId = this.selected.selectedExportBillCouponId == "" ? null : this.selected.selectedExportBillCouponId
                this.selected.selectedExportBillId = this.selected.selectedExportBillId == "" ? null : this.selected.selectedExportBillId

                if (this.selected.selectedExportBillStatus == "" || this.selected.selectedExportBillStatus == 100) {
                    temp = null
                } 
                if (this.selected.selectedExportBillStatus == 10) {
                    temp = 0
                }

                let exportBill = {
                    exportBillId:this.selected.selectedExportBillId,
                    exportBillCouponId:this.selected.selectedExportBillCouponId,
                    exportBillStatus:temp
                }
                let data = {
                    staffId : window.sessionStorage.getItem('staffId'),
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount,
                    exportBill:JSON.stringify(exportBill)
                }
                this.$axios.post('/purchaselist/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.exportBillList_lazzy = res.data.exportBillList
                        this.queryInfo.total = res.data.recordSum

                        this.exportBillList_lazzy.map((item) => {
                            if (item.exportBillProductionDate != null) {
                                let date = new Date(item.exportBillProductionDate)
                                item.exportBillProductionDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                                date = new Date(item.exportBillTime)
                                item.exportBillTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                            }
                        })

                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //查看采购入库单弹窗
            lookDialogInfo(rowInfo) {
                let data = {
                    exportBillId: rowInfo.exportBillId
                }
                this.$axios.post('/purchaselist/purchasedetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.category = res.data.category
                        this.coupon = res.data.coupon
                        this.exportBill = res.data.exportBill
                        this.goods = res.data.goods
                        this.unit = res.data.unit

                        let date = new Date(this.coupon.couponTime)
                        this.coupon.couponTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        date = new Date(this.exportBill.exportBillProductionDate)
                        this.exportBill.exportBillProductionDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        date = new Date(this.exportBill.exportBillTime)
                        this.exportBill.exportBillTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

                        if (this.exportBill.exportBillRemark == null) {
                            this.exportBill.exportBillRemark = '暂无'
                        }
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.lookDialog = true
            },
            // 修改采购入库单弹窗
            editDialogInfo(rowInfo) {
                let data = {
                    exportBillId: rowInfo.exportBillId
                }
                this.$axios.post('/purchaselist/purchasedetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.category = res.data.category
                        this.coupon = res.data.coupon
                        this.exportBill = res.data.exportBill
                        this.goods = res.data.goods
                        this.unit = res.data.unit

                        // let date = new Date(this.coupon.couponTime)
                        // this.coupon.couponTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        // date = new Date(this.exportBill.exportBillProductionDate)
                        // this.exportBill.exportBillProductionDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        // date = new Date(this.exportBill.exportBillTime)
                        // this.exportBill.exportBillTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.editDialog = true
            },
            editDialog1() {
                let flag = this.onNumChange('产品批号',this.exportBill.exportBillGoodsBatchNumber)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('供货编号',this.exportBill.exportBillSupplierId)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('已付款项',this.exportBill.exportBillPaid)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('供货价格',this.exportBill.exportBillPrice)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('保质期',this.exportBill.exportBillShelfLife)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('生产日期',this.exportBill.exportBillProductionDate)
                if (flag == -1) {
                    return
                }
                this.exportBill.exportBillProductionDate = new Date(this.exportBill.exportBillProductionDate).getTime()
                this.exportBill.exportBillTime = new Date().getTime()
                

                let data = {
                    exportBill:JSON.stringify(this.exportBill)
                }
                
                this.$axios.post('/purchaselist/purchasedetails/modify', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('信息修改成功')
                        if (this.isLazzy) {
                            this.searchExportBill()
                        } else {
                            this.getPurchaseList()
                        }
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })  
                .catch((err) => {
                    this.$message.error(err.message)
                })  
                this.editDialog = false
            },
            //确认入库
            async confirmIntoStore(exportBill) {
                let status = exportBill.exportBillStatus
                if (status == 3) {
                    this.$message.error('入库失败, 不允许重复入库')
                } else if (status == -1) {
                    this.$message.error('入库失败, 库房管理员审核不通过')
                } else {
                    let temp = ''
                    if (status == -2) {
                        temp = '职工审核不通过, ' 
                    } else if (status == 0) {
                        temp = '职工未审核, '
                    }
                    const confirmResult = await this.$confirm(temp + '是否确认入库？','确认入库',{
                        confirmButtonText:'入库',
                        showCancelButton:true,
                        type: 'success'
                    })
                    .catch(err => {
                        this.$message.info('操作取消')
                    })

                    if (confirmResult == 'confirm') {
                        let data = {
                            staffId : window.sessionStorage.getItem('staffId'),
                            exportBillId:exportBill.exportBillId
                        }
                        this.$axios.post('/purchaselist/confirm', this.$qs.stringify(data), {
                            headers:{
                                staffToken: window.sessionStorage.getItem('staffToken')
                            }
                        })
                        .then((res) => {
                            if (res.data.success) {
                                this.$message.success('成功入库')
                            } else {
                                this.$message.error(res.data.errMsg)
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.message)
                        })
                    }
                }
            },
            //拒收
            async rejectIntoStore(exportBill) {
                let status = exportBill.exportBillStatus
                if (status == 3) {
                    this.$message.error('入库失败, 采购入库单已成功入库')
                } else if (status == -1) {
                    this.$message.error('入库失败, 采购入库单已被库房管理员驳回')
                }  else {
                    const confirmResult = await this.$confirm('此操作不可恢复，是否拒绝这条入库信息？','拒收',{
                        confirmButtonText:'拒收',
                        showCancelButton:true,
                        type: 'warning'
                    })
                    .catch(err => {
                        this.$message.info('操作取消')
                    })

                    if (confirmResult == 'confirm') {
                        let data = {
                            staffId : window.sessionStorage.getItem('staffId'),
                            exportBillId: exportBill.exportBillId
                        }
                        this.$axios.post('/purchaselist/rejection', this.$qs.stringify(data), {
                            headers:{
                                staffToken: window.sessionStorage.getItem('staffToken')
                            }
                        })
                        .then((res) => {
                            if (res.data.success) {
                                this.$message.success('成功拒收')
                            } else {
                                this.$message.error(res.data.errMsg)
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.message)
                        })
                    }
                }
            },
            //判断合法性
            onNumChange(name, text_number){
                if (name == '供货编号'  ||  name == '保质期') {
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else if(isNaN(text_number)) {
                        this.$message.error(name + "存在不合法的输入")
                        return -1
                    } else if (text_number <= 0) {
                        this.$message.error(name + "必须大于0")
                        return -1
                    } else if (parseInt(text_number) != text_number) {
                        this.$message.error(name + "存在非法整数")
                        return -1
                    } else {
                        return  0
                    }
                } else if (name == '产品批号') {
                    console.log(text_number.length)
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else if(isNaN(text_number)) {
                        this.$message.error(name + "存在不合法的输入")
                        return -1
                    } else if (text_number <= 0) {
                        this.$message.error(name + "必须大于0")
                        return -1
                    } else if (parseInt(text_number) != text_number) {
                        this.$message.error(name + "存在非法整数")
                        return -1
                    } else if (text_number.length > 8 || text_number < 6) {
                        this.$message.error(name + "必须位于6~8位之间")
                        return -1
                    } else {
                        return  0
                    }
                } else if (name == '供货价格' || name == '已付款项') {
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else if(isNaN(text_number)) {
                        this.$message.error(name + "存在不合法的输入")
                        return -1
                    } else if (text_number <= 0) {
                        this.$message.error(name + "必须大于0")
                        return -1
                    } else {
                        return  0
                    }
                } else if (name == '生产日期') {
                    if (text_number == undefined) {
                        this.$message.error(name + "不能为空")
                        return -1
                    } else {
                        return 0
                    }
                } else {
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else {
                        return  0
                    }
                }
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
.el-button{
    margin: 0 5px;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
.all_img{
    width: 100px;
}
</style>