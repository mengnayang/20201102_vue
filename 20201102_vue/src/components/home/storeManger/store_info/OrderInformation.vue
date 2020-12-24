<template>
    <div class="view_stock_taking_rules_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存信息</el-breadcrumb-item>
            <el-breadcrumb-item>订单信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row>
                <el-col :span="2">
                    <span>订单编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedCouponId" size="mini" placeholder="请输入查询的订单编号" clearable></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <span>商品编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedCouponGoodsId" size="mini" placeholder="请输入查询的商品编号" clearable></el-input>
                </el-col>
                <el-col :span="8" :offset="1">
                    <span>订货状态</span>
                    <el-select size="mini" v-model="selected.selectedOrderStatus">
                        <el-option :key="100" label="全部" :value="100"></el-option>
                        <el-option :key="10" label="订货中" :value="10"></el-option>
                        <el-option :key="1" label="订货成功" :value="1"></el-option>
                        <el-option :key="-1" label="订货失败" :value="-1"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" size="mini" @click="searchOrder()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="isLazzy ? couponList : orderList" border stripe>
                <el-table-column label="订单编号" prop="couponId" fixed width="100" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="couponGoodsId" fixed width="160" align="center"></el-table-column>
                <el-table-column label="供货单位" prop="couponUnitId" width="100" align="center"></el-table-column>
                <el-table-column label="订货数量" prop="couponNum" width="120" align="center"></el-table-column>
                <el-table-column label="订货时间" prop="couponTime" width="120" align="center"></el-table-column>
                <el-table-column label="订货状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.couponStatus == 0">订货中</span>
                        <span v-else-if="scope.row.couponStatus == 1">订货成功</span>
                        <span v-else>订货失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作职工" prop="couponStaffId" width="120" align="center"></el-table-column>
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
        </el-card>
        <el-pagination
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 查看订单详情 -->
        <el-dialog title="订单信息" :visible.sync="lookDialog" width="800px">
            <el-form>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订单编号:">
                            <span>{{currentOrder.coupon.couponId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订货时间:">
                            <span>{{currentOrder.coupon.couponTime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订货数量:">
                            <span>{{currentOrder.coupon.couponNum}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="订货状态:">
                            <span v-if="currentOrder.coupon.couponStatus == -1">订货失败</span>
                            <span v-else-if="currentOrder.coupon.couponStatus == 1">订货成功</span>
                            <span v-else-if="currentOrder.coupon.couponStatus == 0">订货中</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="操作职工:">
                            <span>{{currentOrder.staff.staffName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品编号:">
                            <span>{{currentOrder.goods.goodsId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品名称:">
                            <span>{{currentOrder.goods.goodsName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="商品类别:">
                            <span>{{currentOrder.category.categoryName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="品牌名称:">
                            <span>{{currentOrder.goods.goodsBrand}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="产品规格:">
                            <span>{{currentOrder.goods.goodsSpecifications}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="单位:">
                            <span>{{currentOrder.unit.unitName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="2">
                        <el-form-item label="商品图片:">
                            <template>
                                <img :src="$store.state.imgBaseURL + currentOrder.goods.goodsPicture" alt="图片" class="all_img">  
                            </template>
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
        name:'OrderInfomation',
        data() {
            return {
                //查询订单的先决条件
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //订单列表
                orderList:[],
                //功能列表
                functionList:[],
                //一级功能列表
                functionList_one:[],
                //是否渲染按钮
                isDraw:false,
                //查看订单详情弹框
                lookDialog:false,
                currentOrder:{
                    category:'',
                    coupon:'',
                    goods:'',
                    staff:'',
                    unit:''
                },
                // 查询信息
                selected:{
                    selectedOrderStatus:'',
                    selectedCouponGoodsId:'',
                    selectedCouponId:''
                },
                // 是否模糊查询
                isLazzy:false,
                // 模糊查询后列表
                couponList:[]
            }
        },
        created() {
            this.getOrderList(),
            this.selected.selectedOrderStatus = 100
        },
        methods:{
            //获取部分订单信息
            getOrderList() {
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
                    staffId: window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/orderInformation',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.orderList = res.data.couponList
                        this.queryInfo.total = res.data.couponCount
                        this.functionList = res.data.functionList
                        this.queryInfo.total = res.data.recordSum
                        this.orderList.map((item) => {
                            let data = new Date(item.couponTime)
                            item.couponTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
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
            drawBtn() {
                //渲染功能按钮
                    if(!this.isDraw) {
                        for (let i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionWeight == 1) {
                                this.$set(this.functionList[i],"btnType","primary")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                                this.functionList_one.push(this.functionList[i])
                            }  
                        }
                        this.isDraw = true
                    }
            },
            //模糊查询
            searchOrder() {
                this.isLazzy = true
                let temp = this.selected.selectedOrderStatus
                this.selected.selectedCouponId = this.selected.selectedCouponId == "" ? null : this.selected.selectedCouponId
                this.selected.selectedCouponGoodsId = this.selected.selectedCouponGoodsId == "" ? null : this.selected.selectedCouponGoodsId

                if (this.selected.selectedOrderStatus == ""  || this.selected.selectedOrderStatus == 100) {
                    temp = null
                } 
                if (this.selected.selectedOrderStatus == 10) {
                    temp = 0
                }

                let coupon = {
                    couponId:this.selected.selectedCouponId,
                    couponGoodsId:this.selected.selectedCouponGoodsId,
                    couponStatus:temp
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    coupon:JSON.stringify(coupon),
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount
                }
                this.$axios.post('/orderInformation/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.couponList = res.data.couponList
                        this.queryInfo.total = res.data.recordSum
                        this.couponList.map((item) => {
                            let data = new Date(item.couponTime)
                            item.couponTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
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
                this.queryInfo.pageIndex = currentPage
                if (this.isLazzy) {
                    this.searchOrder()
                } else {
                    this.getOrderList()
                }
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionWeight) {
                if (functionWeight == 1) {
                    this.lookDialogInfo(rowInfo)
                } 
            },
            //查看订单详情
            lookDialogInfo(rowInfo) {
                let data = {
                    couponId: rowInfo.couponId
                }
                this.$axios.post('/orderInformation/orderdetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.currentOrder.unit = res.data.unit
                        this.currentOrder.category = res.data.category
                        this.currentOrder.staff = res.data.staff
                        this.currentOrder.goods = res.data.goods
                        this.currentOrder.coupon = res.data.coupon
                        let data = new Date(this.currentOrder.coupon.couponTime)
                        this.currentOrder.coupon.couponTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.lookDialog = true
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
.el-pagination{
    width: 70%;
    margin: 10px auto;
}
.all_img{
    width: 100px;
}
</style>