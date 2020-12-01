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
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>出库编号</span>
                    <!-- <el-select size="small">
                        <el-option></el-option>
                    </el-select> -->
                </el-col>
                <el-col :span="8">
                    <span>订单编号</span>
                    <!-- <el-select size="small">
                        <el-option></el-option>
                    </el-select> -->
                </el-col>
                <el-col :span="8">
                    <span>订单发起人</span>
                    <!-- <el-select size="small">
                        <el-option></el-option>
                    </el-select> -->
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>状态</span>
                    <!-- <el-select size="small">
                        <el-option></el-option>
                    </el-select> -->
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="deliveryRecordList" border stripe>
                <el-table-column label="出库编号" prop="deliveryId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="deliveryPaid" fixed width="120" align="center"></el-table-column>
                <el-table-column label="出库状态" prop="deliveryStatus"  width="120" align="center"></el-table-column>
                <el-table-column label="发起职工" prop="deliveryLaunchedStaffId"  width="120" align="center"></el-table-column>
                <el-table-column label="处理职工" prop="deliveryHandleStaffId" width="120" align="center"></el-table-column>
                <el-table-column label="总价格" prop="deliveryTotalPrice" width="120" align="center"></el-table-column>
                <el-table-column label="结账状态" prop="deliveryCheckOutStatus" width="80" align="center"></el-table-column>
                <el-table-column label="退款状态" prop="deliveryRefundStatus" width="180" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="deliveryCreateDate" width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
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
                    pageIndex:0,
                    infoCount:4
                },
                //二级菜单
                secondaryMenuList:[],
                //二级菜单id
                secondaryMenuId:'',
                //功能列表
                functionList:[],
                //批发出库单列表
                deliveryRecordList:[]
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
                // console.log(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        // console.log(this.secondaryMenuList[i].secondaryMenuId)
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                // console.log(this.secondaryMenuId)
                let data = {
                    pageIndex: this.queryInfo.pageIndex,
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
                        // console.log(res)
                        this.functionList = res.data.functionList
                        this.deliveryRecordList = res.data.deliveryRecordList
                        this.queryInfo.infoCount = res.data.recordSum
                        console.log(this.deliveryRecordList)
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
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>