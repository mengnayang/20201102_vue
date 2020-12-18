<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>日期盘点</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>商品批号</span>
                    <el-select v-model="selected.selectedGoodName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_name" :key="item.goods_id" :value="item.goods_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-select v-model="selected.selectedGoodCategory" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_category" :key="item.goods_id" :value="item.goods_category"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>品牌类别</span>
                    <el-select v-model="selected.selectedGoodId" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.goods_id" :key="item.goods_id" :value="item.goods_id"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>入库编号</span>
                    <el-select v-model="selected.selectedBrandName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in exportBillList" :label="item.brand_name" :key="item.goods_id" :value="item.brand_name"></el-option>
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
                <el-table-column label="入库编号" prop="exportBillId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品批号" prop="exportBillCouponId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="exportBillGoodsBatchNumber" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goods_category" width="120" align="center"></el-table-column>
                <el-table-column label="品牌类别" prop="brand_name" width="120" align="center"></el-table-column>
                <el-table-column label="库存量" prop="goods_store" width="80" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="exportBillProductionDate" width="120" align="center"></el-table-column>
                <el-table-column label="保质期/天" prop="exportBillShelfLife" width="90" align="center"></el-table-column>
                <!-- <el-table-column label="规格" prop="unit" width="180" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="exportBillTime" width="80" align="center"></el-table-column>
                <el-table-column label="入库转态" prop="exportBillStatus" :formatter="checkNum"  width="80" align="center" ></el-table-column> -->
                <!-- 根据true或者false选择 -->
                <el-table-column label="审核状态"  prop="check_status" :formatter="stateFormat" width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" plain  @click="openDialog(scope.row)">检查</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 修改商品信息弹框 -->
            <el-dialog title="修改商品信息" :visible.sync="lookGoodDialog" width="700px">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
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
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text" v-model="currentGood.goods_id"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品批号">
                                <el-input type="text" v-model="currentGood.goods_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text" v-model="currentGood.goods_category"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentGood.brand_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="10">
                            <el-form-item label="生产日期"> 
                                <el-date-picker v-model="currentGood.date_manufacture" type="date" placeholder="请选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentGood.shelf_life"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="过期日期"> 
                                <el-input type="text" v-model="currentGood.shelf_life"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        
                        <el-col :span="5">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentGood.goods_price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentGood.standards"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentGood.unit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="入库编号"> 
                                <el-input type="text" v-model="currentGood.goods_store"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentGood.goods_store"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="盘点备注"> 
                                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="currentGood.check_goods_num"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="primary" @click="shutDialog()">取消</el-button>
                    <el-button type="success" @click="confirmDialog()">确认提交</el-button>
                </span>
            </el-dialog>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[3]" :page-size="3" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total">
        </el-pagination>
    </div>
</template>

<script>
    export default{
        name:'CheckInbound',
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
                //设置查看订单信息的弹窗是否可见
                lookGoodDialog:false,
                //当前操作的订单信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:5,
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
            //获取指定商品的信息
            openDialog(good) {
                //console.log(good)
                this.lookGoodDialog = true
                this.currentGood = good
            },
            //关闭盘点信息弹窗
            shutDialog(){
                this.lookGoodDialog = false
            },
            //确认修改商品信息弹窗
            confirmDialog() {
                this.editGoodDialog = false
                console.log(this.currentGood)
                this.$message.success('修改成功')
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getPartGood()
            },
            //判断盘点数量
            checkNum(row, column) {
                // console.log("数量！！！！！"+row.check_goods_num)
                if (row.check_status) {
                return row.check_goods_num
                } else  {
                return 0
                } 
            },
            //根据传来的盘点状态值显示
            stateFormat(row, column) {
                // console.log("状态！！！！！"+row.check_status)
                if (row.check_status) {
                return '已检查'
                } else  {
                return '未检查'
                } 
            },
            //提交盘点结果
            confirmCheck(){ 

                this.exportBillStatus=true
                this.lookGoodDialog = false
                // console.log("-----------------")
                // console.log(this.currentGood)
                //修改盘点状态
                // 修改了怎么传值？
                
                this.$message.success('盘点成功')

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