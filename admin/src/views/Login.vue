<template>
    <div class="login_container">
        <el-card header="请先登录" class="login_card">
            <el-form @submit.native.prevent="login">
                <el-form-item label="用户名">
                    <el-input v-model="model.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="model.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){ 
        return{
            model:{}
        }
    },
    methods:{
        async login(){
            const res = await this.$http.post('login',this.model)
            //长时间储存在本地浏览器
            localStorage.token = res.data.token
            //短暂性储存在本地浏览器，关闭浏览器 token 值销毁
            //sessionStorage.token= res.data.token 
            this.$router.push('/')
            this.$message({
                type:'success',
                message:'登录成功'
            })
        }
    }
}
</script>


<style scoped>
.login_card{
    width: 25rem;
    margin: 5rem auto;
}
</style>
