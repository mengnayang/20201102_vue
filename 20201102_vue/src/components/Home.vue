<template>
    <div class="home_comtainer">
        nimenhao
    </div>
</template>

<script>
    export default{
        name:'Home',
        data() {
            return{

            }
        },
        created() {
            var token = window.sessionStorage.getItem('token')
            console.log(token)
        }
    }
</script>

<style lang="less" scoped>

</style>