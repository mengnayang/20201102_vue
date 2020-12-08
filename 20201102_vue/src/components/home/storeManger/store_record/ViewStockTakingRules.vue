<template>
    <div class="view_stock_taking_rules_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
            <el-breadcrumb-item>盘点设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 主体框架 -->
            <el-container>
                <el-main>
                    <el-row>
                        <el-col :span="8">
                            <el-table :data="staffList" border stripe @cell-click="getStockStaffId" height="300">
                                <el-table-column label="职工列表" prop="staffName" align="center"></el-table-column>
                            </el-table>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-table :data="categoryListById" border height="300">
                                <el-table-column label="已盘点商品列表" prop="categoryName" align="center"></el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="8">
                            <el-table :data="categoryListById" border v-show="false" height="300">
                                <el-table-column label="未盘点商品列表" prop="categoryName" align="center"></el-table-column>
                            </el-table>
                        </el-col> -->
                        <el-col :span="16">
                            <template>
                                <el-transfer  :titles="['已盘点商品列表', '未盘点商品列表']" :model="categoryListFalseId" :data="categoryListByIdFalse"></el-transfer>
                            </template>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
            <el-row>
                <el-col>
                    <el-button type="success" size="small">修改</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default{
        name:'ViewStockTakingRules',
        data() {
            return {
                //职工信息
                staffList:[],
                //所有职工盘点类别
                categoryList:[],
                //默认显示的盘点职工id
                staffId:1,
                //某员工盘点的商品类别
                categoryListById:[],
                //未盘点的商品类别
                categoryListFalse:[],
                //某员工盘点加未盘点的
                categoryListByIdFalse:[],
                //未盘点的商品类别id
                categoryListFalseId:[]
            }
        },
        created() {
            this.getRules()
        },
        methods:{
            getRules() {
                let data = {}
                this.$axios.post('/stocktaking/viewStocktakingRules', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.staffList = res.data.staffList
                        this.categoryList = res.data.categoryList
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            getStockStaffId(row, column, cell, event) {
                this.staffId = row.staffId

                //根据职工id获取盘点物品
                //先置空，防止数据累加
                this.categoryListById = []
                this.categoryListFalse = []
                this.categoryListByIdFalse = []
                this.categoryListFalseId = []
               
                for (let i = 0; i < this.categoryList.length; i++) {
                    if (this.staffId == this.categoryList[i].stocktakingStaffId) {
                        this.categoryListById.push(this.categoryList[i])
                    } 
                }
                //获取未盘点的商品类别
                for(let i = 0; i < this.categoryList.length; i++) {
                    if (this.categoryList[i].stocktakingStaffId > 0) {
                    }else {
                        this.categoryListFalse.push(this.categoryList[i])
                    }
                }


                //某员工盘点的商品+都未盘点的商品（类型转换）
                let categoryById = this.categoryListById
                let categoryFalse = this.categoryListFalse
                this.categoryListById.map((item) => {
                    this.categoryListByIdFalse.push({
                        key: item.categoryId,
                        label: item.categoryName
                    })
                })
                console.log(this.categoryListByIdFalse)
                this.categoryListFalse.map((item) => {
                    this.categoryListByIdFalse.push({
                        key: item.categoryId,
                        label: item.categoryName
                    })
                })                
                console.log(this.categoryListByIdFalse)
                //存储未盘点商品的类别id（类型转换）
                this.categoryListFalse.map((item)=>{
                    this.categoryListFalseId.push(item.key)
                })

                console.log(this.categoryListByIdFalse)
                console.log(this.categoryListFalseId)
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