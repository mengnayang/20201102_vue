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
                            <el-table :data="staffList" border stripe @cell-click="getStockStaffId" height="290">
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
                                <el-transfer :titles="['已盘点商品列表', '未盘点商品列表']" v-model="temperory.categoryListFalse_1" :data="temperory.categoryListByIdFalse_1" @change="isChange"></el-transfer>
                            </template>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
            <el-row>
                <el-col :span="2" :offset="18">
                    <el-button type="primary" size="small" @click="back()">复原</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="success" size="small" @click="editStocktaking()">修改</el-button>
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
                //点击显示的盘点职工id
                staffId:1,
                //某员工盘点的商品类别
                categoryListById:[],
                //未盘点的商品类别
                categoryListFalse:[],
                categoryListFalse_1:[],
                //员工盘点+所有人未盘点
                categoryListByIdFalse:[],
                categoryListByIdFalse_1:[],
                //当前点击的员工
                currentStaffId:'',
                // 暂存
                temperory:{
                    //未盘点的商品类别
                    categoryListFalse:[],
                    categoryListFalse_1:[],
                    //员工盘点+所有人未盘点
                    categoryListByIdFalse:[],
                    categoryListByIdFalse_1:[],
                },
                //暂存变化的员工
                temperory_staff:[]
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
                this.currentStaffId = row.staffId
                //根据职工id获取盘点物品
                //先置空，防止数据累加
                this.categoryListById = []
                this.categoryListFalse = []
                this.categoryListFalse_1 = []
                this.categoryListByIdFalse = []
                this.categoryListByIdFalse_1 = []
               
                for (let i = 0; i < this.categoryList.length; i++) {
                    if (this.staffId == this.categoryList[i].stocktakingStaffId) {
                        this.categoryListById.push(this.categoryList[i])
                        this.categoryListByIdFalse.push(this.categoryList[i])
                    } 
                }

                //获取未盘点的商品类别
                for(let i = 0; i < this.categoryList.length; i++) {
                    if (this.categoryList[i].stocktakingStaffId > 0) {
                    }else {
                        this.categoryListFalse.push(this.categoryList[i])
                        this.categoryListByIdFalse.push(this.categoryList[i])
                    }
                }

                for (let i = 0; i < this.categoryListByIdFalse.length; i++) {
                    let data = {
                        key: this.categoryListByIdFalse[i].categoryId,
                        label: this.categoryListByIdFalse[i].categoryName
                    }
                    this.categoryListByIdFalse_1.push(data)
                }

                for (let i = 0; i < this.categoryListFalse.length; i++) {
                    this.categoryListFalse_1.push(this.categoryListFalse[i].categoryId)
                }

                //暂存四个数组
                this.temperory.categoryListFalse = this.categoryListFalse
                this.temperory.categoryListFalse_1 = this.categoryListFalse_1
                this.temperory.categoryListByIdFalse = this.categoryListByIdFalse
                this.temperory.categoryListByIdFalse_1 = this.categoryListByIdFalse_1

            },
            // 清空属性
            back() {
                this.$router.go(0)
            },
            //修改盘点类别
            editStocktaking() {
                console.log(this.categoryListFalse_1)
                console.log(this.categoryListByIdFalse_1)
                console.log(this.currentStaffId)
                if (this.categoryListFalse_1.length > 0) {
                    this.$message.error('盘点类别未完全分配')
                } else {
                    let categoryList = []
                    let data = {
                        categoryList:JSON.stringify(categoryList)
                    }
                    console.log(data)
                }
                
                // this.$axios.post('/stocktaking/modifyStocktakingRules',this.$qs.stringify(data),{
                //     headers:{
                //         staffToken: window.sessionStorage.getItem('staffToken')
                //     }
                // })
                // .then((res) => {
                //     if (res.data.success) {
                //         console.log(res.data)
                //     } else {
                //         this.$message.error(res.data.errMsg)
                //     }
                // })
                // .catch((err) => {
                //     this.$message.error(err.message)
                // })
            },
            isChange() {
                // console.log(this.temperory.categoryListByIdFalse_1)
                // console.log(this.temperory.categoryListFalse_1)
                // console.log(this.currentStaffId)
                let temperory_1 = {
                    //未盘点的商品类别
                    categoryListFalse:[],
                    categoryListFalse_1:[],
                    //员工盘点+所有人未盘点
                    categoryListByIdFalse:[],
                    categoryListByIdFalse_1:[],
                }
                for (let i = 0; i < this.temperory_staff.length; i++) {
                    if (this.temperory_staff[i].staffId == this.currentStaffId) {
                    } else {
                        // this.temperory_staff.push({
                        //     staffId:this.temperory_staff[i].staffId,
                        //     categoryListByIdFalse_1:this.temperory_staff[i].categoryListByIdFalse_1,
                        //     categoryListFalse_1:this.temperory_staff[i].categoryListFalse_1
                        // })
                        let data = {
                            staffId:this.temperory_staff[i].staffId,
                            categoryListByIdFalse_1:this.temperory_staff[i].categoryListByIdFalse_1,
                            categoryListFalse_1:this.temperory_staff[i].categoryListFalse_1
                        }
                        // this.temperory_staff.push(data)
                        console.log(data)
                    } 
                }

                this.temperory_staff.push({
                    staffId:this.currentStaffId,
                    categoryListByIdFalse_1:this.temperory.categoryListByIdFalse_1,
                    categoryListFalse_1:this.temperory.categoryListFalse_1
                })
                console.log(this.temperory_staff)
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
.el-transfer-panel{
    .el-transfer-panel__body{
        height:256px
    }
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>