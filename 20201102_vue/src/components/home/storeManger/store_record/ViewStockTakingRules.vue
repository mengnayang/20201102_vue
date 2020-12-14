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
                        <el-col :span="6">
                            <el-table :data="categoryFalse" border max-height="300">
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column align="center" label="未盘点的商品类别" property="categoryName"></el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="16" :offset="1">
                            <el-table :data="staffCategoryList" border max-height="300">
                                <el-table-column type="expand" width="50" align="center">
                                    <template slot-scope="scope">
                                        <el-tag v-for="item in scope.row.category" :key="item.categoryId" closable @close="removeCategoryById(scope.row.staffId,item.categoryId,item.categoryName)">{{item.categoryName}}</el-tag>
                                        <el-tag @click="addCategoryDialog(scope.row)" class="iconfont icon_addCategory"></el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column property="staffName" label="职工姓名" width="150" align="center"></el-table-column>
                                <el-table-column label="已分配的盘点类别" width="390">
                                    <template slot-scope="scope">
                                        <span v-for="(item,index) in scope.row.category" :key="item.staffId" v-if="index <= 5">
                                            {{item.categoryName + " "}}
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
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
        <el-dialog :visible.sync="giveAwayDialog">
            <el-form label-width="150px">
                <el-form-item label="分配类别的职工姓名:">{{currentStaff.staffName}}</el-form-item>
                <el-form-item label="已选商品类别">
                    <el-checkbox v-for="item in currentStaff.category" :key="item.categoryId" :label="item.categoryName" checked @change="statusCategory($event,item.categoryId)"></el-checkbox>
                </el-form-item>
                <el-form-item label="可选商品类别">
                    <el-checkbox v-for="item_1 in categoryFalse" :key="item_1.categoryId" :label="item_1.categoryName" @change="statusCategory($event,item_1.categoryId)"></el-checkbox>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="addPartCategory()">修改</el-button>
                <el-button type="primary" @click="giveAwayDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'ViewStockTakingRules',
        data() {
            return {
                // 职工信息
                staffList:[],
                // 所有职工盘点类别
                categoryList:[],
                //变动
                staffCategoryList:[],
                // 未盘点类别
                categoryFalse:[],
                // 准备分配商品类别的员工Id
                currentStaff:{
                    staffId:'',
                    staffName:'',
                    category:[]
                },
                // 是否显示分配窗口
                giveAwayDialog:false,
                // 已选
                temperory_top:[],
                // 未选
                temperory_down:[],
                secondaryMenuList:[],
                secondaryMenuId:''
            }
        },
        created() {
            this.getRules()
        },
        methods:{
            getRules() {
                this.staffCategoryList = []
                //获取当前的二级菜单的id
                this.secondaryMenuList = JSON.parse(window.sessionStorage.getItem('secondaryMenuList'))
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    secondaryMenuId:this.secondaryMenuId
                }
                this.$axios.post('/stocktaking/viewStocktakingRules', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.staffList = res.data.staffList
                        this.categoryList = res.data.categoryList

                        for (let i = 0; i < this.staffList.length; i++) {
                            let temp = []
                            for (let j = 0; j < this.categoryList.length; j++) {
                                if (this.categoryList[j].stocktakingStaffId == this.staffList[i].staffId) {
                                    temp.push({
                                        categoryId: this.categoryList[j].categoryId,
                                        categoryName: this.categoryList[j].categoryName
                                    })
                                }
                            }
                            this.staffCategoryList.push({
                                staffId:this.staffList[i].staffId,
                                staffName:this.staffList[i].staffName,
                                category: temp,
                            })                             
                        }
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            // 删除员工盘点的指定商品
            removeCategoryById(sId, cId, cname) {
                for (let i = 0; i < this.staffCategoryList.length; i++) {
                    for (let j = 0; j < this.staffCategoryList[i].category.length; j++) {
                        if (this.staffCategoryList[i].category[j].categoryId == cId) {
                            this.$delete(this.staffCategoryList[i].category,j)
                        }
                    }
                }

                this.categoryFalse.push({
                    categoryId: cId,
                    categoryName: cname
                })
            },
            // 为指定员工已盘点/可盘点的商品类别弹框
            addCategoryDialog(rowInfo) {
                this.currentStaff.staffId = rowInfo.staffId
                this.currentStaff.staffName = rowInfo.staffName
                this.currentStaff.category = rowInfo.category
                this.giveAwayDialog = true
                this.temperory =[]

                for (let i = 0; i < rowInfo.category.length; i++) {
                    this.temperory_top.push({
                        categoryId:rowInfo.category[i].categoryId,
                        categoryName:rowInfo.category[i].categoryName,
                        isSelected:1
                    })
                }

                for (let i = 0; i < this.categoryFalse.length; i++) {
                    this.temperory_down.push({
                        categoryId:this.categoryFalse[i].categoryId,
                        categoryName:this.categoryFalse[i].categoryName,
                        isSelected:0
                    })
                }
            },
            statusCategory(event, cId) {
                for (var i = 0; i < this.temperory_top.length; i++) {
                    if (this.temperory_top[i].categoryId == cId) {
                        if (event) {
                            this.temperory_top[i].isSelected = 1;
                        } else {
                            this.temperory_top[i].isSelected = 0;
                        }
                        break;
                    }
                }
                 for (var i = 0; i < this.temperory_down.length; i++) {
                    if (this.temperory_down[i].categoryId == cId) {
                        if (event) {
                            this.temperory_down[i].isSelected = 1;
                        } else {
                            this.temperory_down[i].isSelected = 0;
                        }
                        break;
                    }
                }
            },
            // 修改员工分配的商品盘点类别
            addPartCategory(){
                // 删除商品类别
                for (let i = 0; i < this.temperory_top.length; i++) {
                    if (this.temperory_top[i].isSelected == 0) {
                        this.removeCategoryById(this.currentStaff.staffId, this.temperory_top[i].categoryId, this.temperory_top[i].categoryName)
                    }
                }

                // 增加商品类别
                for (let i = 0; i < this.temperory_down.length; i++) {
                    if (this.temperory_down[i].isSelected == 1) {
                        for (let j = 0; j < this.staffCategoryList.length; j++) {
                            if (this.staffCategoryList[j].staffId == this.currentStaff.staffId) {
                                this.staffCategoryList[j].category.push({
                                    categoryId: this.temperory_down[i].categoryId,
                                    categoryName: this.temperory_down[i].categoryName
                                })
                            }
                        }
                        for (let k = 0; k < this.categoryFalse.length; k++) {
                            if (this.categoryFalse[k].categoryId == this.temperory_down[i].categoryId) {
                                this.$delete(this.categoryFalse, k)
                            }
                        }
                    }
                }            
                this.giveAwayDialog = false
            },
            // 提交盘点设置
            editStocktaking() {
                if (this.categoryFalse.length > 0) {
                    this.$message.warning('请检查盘点类别是否分配完毕。')
                } else {
                    let cg = []
                    for (let i = 0; i < this.staffCategoryList.length; i++) {
                        for (let j = 0; j < this.staffCategoryList[i].category.length; j++) {
                            let data = {
                                categoryId:this.staffCategoryList[i].category[j].categoryId,
                                categoryName: this.staffCategoryList[i].category[j].categoryName,
                                stocktakingStaffId: this.staffCategoryList[i].staffId
                            }
                            cg.push(data)
                        }
                    }
                    let data = {
                        categoryList:JSON.stringify(cg)
                    }
                    this.$axios.post('/stocktaking/modifyStocktakingRules', this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.$message.success('盘点类别设置成功')
                            this.getRules()
                        } else {
                            this.$message.error(res.data)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            // 复原
            back() {
                this.getRules()
            }
        }
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    height: 400px;
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
.el-tag{
    margin: 5px;
}
</style>