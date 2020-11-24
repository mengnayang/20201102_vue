<template>
    <div class="book_enter_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购入库单</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row>
                <el-col :span="8">
                    <span>入库编号</span>
                    <el-select size="small" v-model="selected.selectedEnterStoreId">
                        <el-option v-for="item in enterStoreList" :key="item.goods_id" :value="item.goods_id" :label="item.godown_entry_id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-select size="small" v-model="selected.selectedOrderId">
                        <el-option v-for="item in enterStoreList" :key="item.goods_id" :value="item.goods_id" :label="item.orders_id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品编号</span>
                    <el-select size="small" v-model="selected.selectedGoodId">
                        <el-option v-for="item in enterStoreList" :key="item.goods_id" :value="item.goods_id" :label="item.goods_id"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span>入库状态</span>
                    <el-select size="small" v-model="selected.selectedEnterStoreStatus">
                        <el-option v-for="item in enterStoreList" :key="item.goods_id" :value="item.goods_id" :label="item.godown_entry_status"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <el-button type="primary" size="small" @click="searchBookEnter()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
        <el-table :data="enterStoreList" border>
            <el-table-column label="入库编号" prop="godown_entry_id" width="120px" align="center" fixed></el-table-column>
            <el-table-column label="订单编号" prop="orders_id" width="120px" align="center" fixed></el-table-column>
            <el-table-column label="商品编号" prop="goods_id" width="120px" align="center" fixed></el-table-column>
            <el-table-column label="入库量" prop="godown_entry_num" align="center"></el-table-column>
            <el-table-column label="保质期/天" prop="shelf_life" align="center" width="120px"></el-table-column>
            <el-table-column label="生产日期" prop="date_manufacture" align="center" width="120px"></el-table-column>
            <el-table-column label="进价/元" prop="goods_price" align="center"></el-table-column>
            <el-table-column label="单位" prop="unit" align="center"></el-table-column>
            <el-table-column label="规格" prop="standards" align="center"></el-table-column>
            <el-table-column label="已付款项" prop="godown_entry_ paid" align="center"></el-table-column>
            <el-table-column label="入库日期" prop="godown_entry_date" align="center" width="120px"></el-table-column>
            <el-table-column label="入库状态" prop="godown_entry_status" align="center" width="200px">
                <template slot-scope="scope">
                        <span v-if="scope.row.godown_entry_status==1">经理审核</span>
                        <span v-else-if="scope.row.godown_entry_status==2">财务审核付款</span>
                        <span v-else-if="scope.row.godown_entry_status==3">职工、库房管理员审核</span>
                        <span v-else-if="scope.row.godown_entry_status==4">数量质量不合格审核</span>
                        <span v-else-if="scope.row.godown_entry_status==5">已登记入库流水账</span>
                        <span v-else>失效</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="80px" fixed="right" align="center">
                <template slot-scope="scope">
                    <span slot="footer" class="dialog-footer">
                        <el-button type="text" @click="bookEnter(scope.row)">查看</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" :page-size="queryInfo.infoCount"
            @current-change="currentChange" :total="queryInfo.total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 选中的采购入库单的信息弹框 -->
        <el-dialog title="采购入库单详情" :visible.sync="lookBookEnterDialog" width="700px">
            <!-- 采购单信息表单 -->
            <el-form label-width="80px">
                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="商品图片"> 
                                <!-- eslint-disable-next-line -->
                                <template slot-scope="scope">
                                    <img :src="currentGood.goods_img" alt="图片">
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品名称"> 
                                <el-input type="text" v-model="currentGood.goods_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="订单编号">
                                <el-input type="text" v-model="currentGood.orders_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text" v-model="currentGood.goods_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text" v-model="currentGood.goods_category"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="5">
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentGood.brand_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="生产日期"> 
                                <el-date-picker v-model="currentGood.date_manufacture" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="入库编号"> 
                                <el-input type="text" v-model="currentGood.godown_entry_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="提交日期"> 
                                <el-date-picker v-model="currentGood.godown_entry_date" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentGood.goods_store"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="订单状态"> 
                                <el-input type="text" v-model="currentGood.godown_entry_status">
                                    <!-- <template slot-scope="scope">
                                        <span v-if="scope.row.godown_entry_status==1">经理审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==2">财务审核付款</span>
                                        <span v-else-if="scope.row.godown_entry_status==3">职工、库房管理员审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==4">数量质量不合格审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==5">已登记入库流水账</span>
                                        <span v-else>失效</span>
                                    </template> -->
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentGood.unit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentGood.shelf_life"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentGood.goods_price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentGood.standards"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="shutDialog()">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'BookEnter',
        data(){
            return{
                //获取部分采购入库单的先决条件
                queryInfo:{
                    total:50,
                    pageIndex:1,
                    infoCount:3
                },
                //指定查询需求
                selected:{
                    selectedGoodId:'',
                    selectedOrderId:'',
                    selectedEnterStoreId:'',
                    selectedEnterStoreStatus:''
                },
                //采购入库单信息
                enterStoreList:[],
                //当前查看的商品信息
                currentGood:'',
                //设置是否显示订单的详情弹框
                lookBookEnterDialog:false
            }
        },
        mounted() {
            this.getPartEnterStore()
        },
        methods:{
            //初始获取部分采购入库单
            getPartEnterStore() {
                this.$axios.post('/enterStore/enterStoreInfo',this.selected)
                .then((res) => {
                    this.enterStoreList = res.data.obj
                    //console.log(this.orderList)
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            //查询指定需求的采购入库单
            searchBookEnter() {
                this.$axios.post('/enterStore/enterStoreInfo', this.queryInfo)
                .then((res) => {
                    this.enterStoreList = res.data.obj
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            // 获取指定页面的信息
            currentChange(currentPage) {
                this.queryInfo.pageIndex = currentPage
                this.getPartEnterStore()
            },
            //关闭采购入库单信息弹框
            shutDialog() {
                this.lookBookEnterDialog = false
            },
            //打开采购入库单信息弹框
            bookEnter(bookEnter){
                this.lookBookEnterDialog = true
                this.currentGood = bookEnter
                //console.log(this.currentGood)
            }
        }
    }
</script>

<style lang="less" scpoed>
.el-card{
    margin-top: 10px;
    box-shadow: 0 1px 1px  rgba(0, 0, 0, 0.15);
    .el-row{
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