<template>
    <div class="stock_taking_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
            <el-breadcrumb-item>盘点管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">盘点时间:</el-col>
                        <el-col :span="5">
                            <el-date-picker style="width:150px" type="date" placeholder="请选择查询的盘点时间" size="mini" v-model="recordTime">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="2">第</el-col>
                        <el-col :span="9">
                            <!-- <el-select size="mini">
                                <el-option></el-option>
                            </el-select> -->
                        </el-col>
                        <el-col :span="6">次盘点</el-col>
                    </el-row>
                </el-col>
                <el-col :span="6" :offset="6">
                    <el-button type="warning" size="mini" round>定时盘点</el-button>
                    <el-button type="warning" size="mini" round @click="requestRecord()">发起盘点</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">发起员工:</el-col>
                        <el-col :span="15">
                            <!-- <el-select size="mini">
                                <el-option></el-option>
                            </el-select> -->
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">提交员工:</el-col>
                        <el-col :span="15">
                            <!-- <el-select size="mini">
                                <el-option></el-option>
                            </el-select> -->
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">盘点状态:</el-col>
                        <el-col :span="15">
                            <!-- <el-select size="mini">
                                <el-option></el-option>
                            </el-select> -->
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" round size="mini">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="stockList" border stripe>
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="盘点编号" prop="" align="center" width="180px"></el-table-column>
                <el-table-column label="发起员工" width="170px" prop="" align="center"></el-table-column>
                <el-table-column label="提交员工" width="170px" prop="" align="center"></el-table-column>
                <el-table-column label="盈亏状态" width="170px" prop="" align="center"></el-table-column>
                <el-table-column label="盘点状态" width="170px" prop="" align="center"></el-table-column>
                <el-table-column label="操作" width="190px" align="center"></el-table-column>
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
        name:'StockTaking',
        data() {
            return{
                recordTime:'',
                //库存列表
                stockList:[],
                //查询条件
                queryInfo:{
                    total:0,
                    pageIndex:0,
                    infoCount:4
                },
                //二级菜单列表
                secondaryMenuList:[],
                //二级功能id
                secondaryMenuId:'',
                //功能列表
                functionList:[],
                //员工列表
                staffList:[],
                //员工盘点记录列表
                stocktakingRecordList:[]
            }
        },
        created() {
            this.getStockList()
        },
        methods:{
            //初始获取部分库存信息
            getStockList() {
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

                let data = {
                    pageIndex: this.queryInfo.pageIndex,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId
                }   
                // console.log(window.sessionStorage.getItem('staffToken'))
                this.$axios.post('/stocktaking',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res)
                        this.functionList = res.data.functionList
                        this.staffList = res.data.staffList
                        this.stocktakingRecordList = res.data.stocktakingRecordList
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
                this.getStockList()
            },
            //发起盘点
            requestRecord() {
                let data = {
                    // staffId: 
                    // stockGoodsIdListStr:
                }
                this.$axios.post('/stocktaking/initiateStocktaking',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        console.log(res)
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
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>