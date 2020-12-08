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
            <el-row :gutter="10">
                <!-- <el-col :span="8">
                    <span>入库编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col> -->
                <!-- <el-col :span="8">
                    <span>订货单编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col> -->
                <!-- <el-col :span="8">
                    <span>商品编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col> -->
            </el-row>
            <el-row>
                <!-- <el-col :span="8">
                    <span>状态</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col> -->
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="exportBillList" border stripe>
                <el-table-column label="入库编号" prop="exportBillId" fixed width="160" align="center"></el-table-column>
                <el-table-column label="订单编号" prop="exportBillCouponId" fixed width="100" align="center"></el-table-column>
                <el-table-column label="供货商编号" prop="exportBillSupplierId"  width="100" align="center"></el-table-column>
                <el-table-column label="产品批号" prop="exportBillGoodsBatchNumber"  width="100" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="exportBillProductionDate" width="100" align="center"></el-table-column>
                <el-table-column label="保质期" prop="exportBillShelfLife" width="80" align="center"></el-table-column>
                <el-table-column label="供货价格" prop="exportBillPrice" width="80" align="center"></el-table-column>
                <el-table-column label="订单状态" prop="exportBillStatus" width="100" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="exportBillPaid" width="80" align="center"></el-table-column>
                <el-table-column label="入库日期" prop="exportBillTime" width="100" align="center"></el-table-column>
                <el-table-column label="确认职工" prop="exportConfirmStaffId" width="80" align="center"></el-table-column>
                <el-table-column label="提交职工" prop="exportSubmitStaffId" width="80" align="center"></el-table-column>
                <el-table-column label="备注" prop="exportBillRemark" width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="260" align="center">
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
        <el-pagination
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 采购入库单的信息弹框 -->
        <el-dialog title="采购入库单" :visible.sync="lookDialog" width="600px">
            <el-form>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        库存信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="入库编号：">{{exportBill.exportBillId}}</el-form-item> 
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品批号：">{{exportBill.exportBillGoodsBatchNumber}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供货编号：">{{exportBill.exportBillSupplierId}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入库状态：">{{exportBill.exportBillStatus}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已付款项：">{{exportBill.exportBillPaid}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="入库日期：">{{exportBill.exportBillTime}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认职工：">{{exportBill.exportConfirmStaffId}}</el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提交职工：">{{exportBill.exportSubmitStaffId}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="入库备注：">{{exportBill.exportBillRemark}}</el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        订单信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单编号:">
                            {{coupon.couponGoodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单数量:">
                            {{coupon.couponNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订单时间:">
                            {{coupon.couponTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单状态:">
                            {{coupon.couponStatus}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
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
                    <el-col :span="12">
                        <el-form-item label="商品编号:">
                            {{goods.goodsId}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">
                            {{goods.goodsName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品类别：">
                            {{category.categoryName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称：">
                            {{goods.goodsBrand}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品规格：">
                            {{goods.goodsSpecifications}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品单位：">
                            <span>{{unit.unitName}}</span>
                        </el-form-item>
                    </el-col>
                     <el-col :span="8">
                        <el-form-item label="生产日期：">
                            {{exportBill.exportBillProductionDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期：">
                            {{exportBill.exportBillShelfLife}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供货价格：">
                            {{exportBill.exportBillPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="商品图片：">
                            <img :src="goods.goodsPicture" alt="图片">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="lookDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 修改采购入库单的信息弹框 -->
        <el-dialog title="修改采购入库单" :visible.sync="editDialog" width="600px">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="11" :offset="11" class="title">
                        库存信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="入库编号：">
                            <el-input v-model="exportBill.exportBillId" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品批号：">
                            <el-input v-model="exportBill.exportBillGoodsBatchNumber" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供货编号：">
                            <el-input v-model="exportBill.exportBillSupplierId" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入库状态：">
                            <el-input v-model="exportBill.exportBillStatus" size="small"></el-input>    
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已付款项：">
                            <el-input v-model="exportBill.exportBillPaid" size="small"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="确认职工：">
                            <el-input v-model="exportBill.exportConfirmStaffId" size="small"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="入库日期：">
                            <el-date-picker v-model="exportBill.exportBillTime"></el-date-picker>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="提交职工：">
                            <el-input v-model="exportBill.exportSubmitStaffId" size="small"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="入库备注：">
                            <el-input type="textarea" placeholder="暂无" v-model="exportBill.exportBillRemark" size="small"></el-input>
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
                        <el-form-item label="订单编号:">
                            <el-input v-model="coupon.couponGoodsId" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单数量:">
                            <el-input v-model="coupon.couponNum" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                            <el-input v-model="coupon.couponStatus" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="订单时间:" width="100">
                            <el-date-picker v-model="coupon.couponTime" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发起职工:">
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
                        <el-form-item label="商品编号:">
                            <el-input v-model="goods.goodsId" size="small" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">
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
                        <el-form-item label="供货价格：">
                            <el-input v-model="exportBill.exportBillPrice" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期：">
                            <el-input v-model="exportBill.exportBillShelfLife" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="exportBill.exportBillProductionDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品图片：">
                            <img :src="goods.goodsPicture" alt="图片">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="editDialog1()">确认修改</el-button>
                <el-button type="primary" @click="editDialog = false">取消</el-button>
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
                    infoCount:4
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //采购入库单
                exportBillList:[],
                //功能列表
                functionList:[],
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
                editDialog:false
            }
        },
        created() {
            this.getPurchaseList()
        },
        methods:{
            //获取部分采购入库单
            getPurchaseList() {
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
                this.$axios.post('/purchaselist',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.functionList = res.data.functionList
                        this.exportBillList = res.data.exportBillList
                        this.queryInfo.infoCount = res.data.recordSum
                        this.exportBillList.map((item) => {
                            let date = new Date(item.exportBillProductionDate)
                            item.exportBillProductionDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                            date = new Date(item.exportBillTime)
                            item.exportBillTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
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
                this.queryInfo.pageIndex(currentPage)
                this.getPurchaseList()
            },
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 1) {
                            this.$set(this.functionList[i],"btnType","primary")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                        } else if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                        } else if (this.functionList[i].functionWeight == 3) {
                            this.$set(this.functionList[i],"btnType","warning")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_confirm")
                        } else if (this.functionList[i].functionWeight == 4) {
                            this.$set(this.functionList[i],"btnType","danger")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_reject")
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
                const confirmResult = await this.$confirm('确认相关入库信息已正确填写？','确认入库',{
                    confirmButtonText:'确认入库',
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
            },
            //拒收
            async rejectIntoStore(exportBill) {
                const confirmResult = await this.$confirm('此操作不可恢复，是否拒绝这条入库信息？','拒收',{
                    confirmButtonText:'确认拒收',
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