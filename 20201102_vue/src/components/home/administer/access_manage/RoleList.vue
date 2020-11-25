<template>
    <div class="role_list_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default{
        name: 'RoleList',
        data() {

        },
        methods:{

        }
    }
</script>

<style lang="less" scoped>

</style>