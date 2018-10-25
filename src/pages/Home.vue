<template>

    <div>
      
    </div>
</template>

<script>
    import request from '../util/request.js'

    export default {
      name: 'Home',
      // 组件挂在完毕的时候发个请求,请求服务器的数据
      mounted() {
        request({
          url: '/api/home',
          method: 'get'
        }).then(({ data }) => {
          console.log(data);
        })
      },
    }
</script>

<style scoped>

</style>
