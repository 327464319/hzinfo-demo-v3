<template>
  <basic-container>
    <div class="hz-home">华自INFO信息化平台</div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'wel',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleChange (val) {
      window.console.log(val)
    }
  }
}
</script>

<style>
.el-font-size {
  font-size: 14px;
}
.hz-home {
}
</style>
