<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>退货检查</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>退货单号</span>
                    <el-select v-model="selected.selectedGoodId" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_id" :key="item.goods_id" :value="item.goods_id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品编号</span>
                    <el-select v-model="selected.selectedGoodName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_name" :key="item.goods_id" :value="item.goods_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>货物状态</span>
                    <el-select v-model="selected.selectedGoodCategory" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_category" :key="item.goods_id" :value="item.goods_category"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>库存量</span>
                    <el-select v-model="selected.selectedBrandName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.brand_name" :key="item.goods_id" :value="item.brand_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>审核状态</span>
                    <el-select v-model="selected.selectedCheckStatus" filterable placeholder="请选择" size="small">
                        <!-- 暂时这样写 -->
                        <el-option v-for="item in ['未审核','已审核']"  :key="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="exportBillList" border>
                <el-table-column label="商品图片" fixed width="100" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.goods_img" width="30px" height="20px" alt="图片">
                    </template>
                </el-table-column>
                <el-table-column label="退货编号" prop="exportBillId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="exportBillCouponId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="exportBillGoodsBatchNumber" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品数量" prop="exportBillGoodsBatchName" fixed width="120" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="exportBillProductionDate" width="120" align="center"></el-table-column>
                <el-table-column label="保质期/天" prop="exportBillShelfLife" width="90" align="center"></el-table-column>
                <el-table-column label="规格" prop="unit" width="180" align="center"></el-table-column>
                <el-table-column label="入库量" prop="goods_store" width="120" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="exportBillTime" width="80" align="center"></el-table-column>
                <el-table-column label="入库转态" prop="exportBillStatus" :formatter="checkStatus"  width="80" align="center" ></el-table-column>
                <!-- 根据true或者false选择 -->
                <el-table-column label="审核状态"  prop="check_status" :formatter="stateFormat" width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" plain @click="checkSuccesss(scope.row)">检查通过</el-button>
                        <el-button size="small" type="warning" plain @click="checkFailure(scope.row)">检查不通过</el-button>
                    </template>   
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[3]" :page-size="3" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total">
        </el-pagination>
    </div>
</template>

<script>
    export default{
        name:'CheckBackGoods',
        data() {
            return{
                //入库订单信息
                exportBillList:[],
                //指定查询需求
                selected:{
                    selectedGoodId:'',
                    selectedGoodName:'',
                    selectedGoodCategory:'',
                    selectedBrandName:'',
                    selectedCheckStatus:''
                },
                //当前操作的订单信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:3,
                    total:50
                }
            }
        },
        mounted(){
            this.getPartGood()
        },
        methods:{
            //初始获取部分信息
            getPartGood() {
                // console.log(this.queryInfo.pageIndex)
                // console.log(this.queryInfo.infoCount)
                this.$axios.post('/export/checkExport', this.queryInfo)
                .then((res) => {
                    //console.log(res.data.obj)
                    this.exportBillList = res.data.obj
                })
                .catch((res) => {
                    this.$message.error(err)
                })
            },
            //查询指定需求的商品
            searchGood(){
                this.$axios.post('/export/checkExport',this.selected)
                .then((res) => {
                    this.exportBillList = res.data.obj
                    //console.log(res)
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },

            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getPartGood()
            },
            //判断盘点数量
            checkStatus(row, column) {
                // console.log("数量！！！！！"+row.check_goods_num)
                if (row.check_status) {
                return '已入库'
                } else  {
                return '未入库'
                } 
            },
            //根据传来的审核状态值显示
            stateFormat(row, column) {
                // console.log("状态！！！！！"+row.check_status)
                if (row.check_status=='1') {
                return '检查通过'
                } else  if(row.checkStatus=='0'){
                return '未检查'
                } else{
                    return '检查未通过'
                }
            },
            checkSuccesss(row){
                row.checkStatus=true
            },
            checkFailure(row){
                row.checkStatus=false
            }

        }
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
    .el-row {
        margin-bottom: 10px;
        &:last-child {
        margin-bottom: 0;
        }
    }
}
.el-pagination{
    margin-top: 10px;
    padding-left: 120px;
}
</style>