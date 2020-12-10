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
            <!-- <el-row :gutter="10">
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-select size="small">
                        <el-option></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>品牌名称</span>
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
            <!-- 表单区域 -->
            <el-table :data="orderList" border stripe>
                <el-table-column label="订单编号" prop="couponId" fixed width="100" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="couponGoodsId" fixed width="160" align="center"></el-table-column>
                <el-table-column label="供货单位" prop="couponUnitId" width="100" align="center"></el-table-column>
                <el-table-column label="订货数量" prop="couponNum" width="120" align="center"></el-table-column>
                <el-table-column label="订货时间" prop="couponTime" width="120" align="center"></el-table-column>
                <el-table-column label="订货状态" prop="couponStatus" width="100" align="center"></el-table-column>
                <el-table-column label="操作职工" prop="couponStaffId" width="120" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
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
        <!-- 查看订单详情 -->
        <el-dialog title="订单信息" :visible.sync="lookDialog" width="500px">
            <el-form>
                <el-row>
                    <el-col :span="12" :offset="10" class="title">订单信息</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单编号:">{{currentOrder.coupon.couponId}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订货时间:">{{currentOrder.coupon.couponTime}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订货数量:">{{currentOrder.coupon.couponNum}}</el-form-item>
                    </el-col>  
                    <el-col :span="8">
                        <el-form-item label="订货状态:">{{currentOrder.coupon.couponStatus}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作职工:">{{currentOrder.staff.staffName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="10" class="title">商品信息</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品编号:">{{currentOrder.goods.goodsId}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">{{currentOrder.goods.goodsName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品类别:">{{currentOrder.category.categoryName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称:">{{currentOrder.goods.goodsBrand}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="产品规格:">{{currentOrder.goods.goodsSpecifications}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="单位:">{{currentOrder.unit.unitName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品图片:">
                            <img :src="currentOrder.goods.goodsPicture" alt="图片">
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
                    infoCount:4
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //订单列表
                orderList:[],
                //功能列表
                functionList:[],
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
                }
            }
        },
        created() {
            this.getOrderList()
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
                            } 
                            this.isDraw = true
                        }
                    }
            },
            //根据指定页码获取相应的库存信息
            currentChange(currentPage) {
                this.queryInfo.pageIndex(currentPage)
                this.getOrderList()
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
    width: 50%;
    margin: 10px auto;
}
</style>