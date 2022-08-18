
<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>
<script setup lang="ts">
// 使用element ui 中文
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// 若单独运行则引入 reset.css, 若在微前端下也引入会导致样式冲突
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  import('@/assets/css/reset.css')
}
</script>
<style lang="scss">
@import './assets/css/common.scss';
#app{
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
