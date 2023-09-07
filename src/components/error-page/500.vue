<template>
  <div class="error-page">
    <div class="img"
         style=" background-image: url('/img/bg/500.svg');"></div>
    <div class="content">
      <h1>500</h1>
      <div class="desc">抱歉，服务器出错了</div>
      <div class="actions">
        <section v-if="!__POWERED_BY_QIANKUN__">
          <router-link :to="{path:'/'}">
            <el-button type="primary">返回首页</el-button>
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  export default {
    name: "error-500",
    computed: 
        mapGetters(["__POWERED_BY_QIANKUN__"]),
  };
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
