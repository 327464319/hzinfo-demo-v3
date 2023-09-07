<template>
<!--  <div class="menu-wrapper">-->
<!--    &lt;!&ndash; <template v-for="item in menuApps">-->
<!--      <el-menu-item>{{item.name}}</el-menu-item>-->
<!--    </template> &ndash;&gt;-->
<!--    <template v-for="item in menu">-->
<!--      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"-->
<!--                    :index="item[pathKey]"-->
<!--                    @click="open(item)"-->
<!--                    :key="item[labelKey]"-->
<!--                    :class="{'is-active':vaildAvtive(item)}">-->
<!--        <i :class="item[iconKey]"></i>-->
<!--        <span slot="title"-->
<!--              :alt="item[pathKey]">{{generateTitle(item)}}</span>-->
<!--      </el-menu-item>-->
<!--      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"-->
<!--                  :index="item[pathKey]"-->
<!--                  :key="item[labelKey]">-->
<!--        <template v-slot:title>-->
<!--          <i :class="item[iconKey]"></i>-->
<!--          <span slot="title"-->
<!--                :class="{'el-menu&#45;&#45;display':collapse && first}">{{generateTitle(item)}}</span>-->
<!--        </template>-->
<!--        <template v-for="(child,cindex) in item[childrenKey]">-->
<!--          <el-menu-item :index="child[pathKey],cindex"-->
<!--                        @click="open(child)"-->
<!--                        :class="{'is-active':vaildAvtive(child)}"-->
<!--                        v-if="validatenull(child[childrenKey])"-->
<!--                        :key="child[labelKey]">-->
<!--            <i :class="child[iconKey]"></i>-->
<!--            <span slot="title">{{generateTitle(child)}}</span>-->
<!--          </el-menu-item>-->
<!--          <sidebar-item v-else-->
<!--                        :menu="[child]"-->
<!--                        :key="cindex"-->
<!--                        :props="props"-->
<!--                        :screen="screen"-->
<!--                        :collapse="collapse"></sidebar-item>-->
<!--        </template>-->
<!--      </el-submenu>-->
<!--    </template>-->
<!--  </div>-->
</template>
<script>
  import {mapGetters} from 'vuex'
  // import {apps} from "@micro/apps";
  import {validatenull} from '@/util/validate'
  import config from './config.js'

  console.log('sidebarItem')

  export default {
    name: 'sidebarItem',
    data () {
      return {
        config
      }
    },
    props: {
      menu: {
        type: Array
      },
      menuApps: {
        type: Array
      },
      screen: {
        type: Number
      },
      first: {
        type: Boolean,
        default: false
      },
      props: {
        type: Object,
        default: () => {
          return {}
        }
      },
      collapse: {
        type: Boolean
      }
    },
    created () {
    },
    mounted () {

    },
    computed: {
      ...mapGetters(['roles']),
      labelKey () {
        return this.props.label || this.config.propsDefault.label
      },
      pathKey () {
        return this.props.path || this.config.propsDefault.path
      },
      iconKey () {
        return this.props.icon || this.config.propsDefault.icon
      },
      childrenKey () {
        return this.props.children || this.config.propsDefault.children
      },
      nowTagValue () {
        return this.$router.$avueRouter.getValue(this.$route)
      }
    },
    methods: {
      clickPush (subapp) {
        console.log('subapp', subapp)
        console.log('apps', this.menuApps)
        // history.pushState(null, subapp, subapp)
        // console.log(history)
        // let { name, params,query} = {};
        // if(typeof route === 'string'){
        //     name = route;
        // }else{
        //     name = route.name;
        //     query = route.query;
        //     params = route.params;
        // }
        // // 如果名字里 含有 'isTurnByHref_' 字符串，就浏览器打开新窗口，跳转外连接 _ 后的内容
        // if(name.indexOf('isTurnByHref_') > -1){
        //     window.open(name.split('_')[1]);
        //     return;
        // }
        this.menuApps.forEach((item) => {
          if (item.name == subapp) {
            console.log(this.$router)
            this.$router.push({
              name: item.name
            })
          }
        })
      },
      generateTitle (item) {
        return this.$router.$avueRouter.generateTitle(
          item[this.labelKey],
          (item.meta || {}).i18n
        )
      },
      vaildAvtive (item) {
        const groupFlag = (item.group || []).some(ele =>
          this.$route.path.includes(ele)
        )
        // console.log(this.nowTagValue, item[this.pathKey] || groupFlag)
        // console.log(this.nowTagValue === item[this.pathKey] || groupFlag)

        return this.nowTagValue === item[this.pathKey] || groupFlag
      },
      vaildRoles (item) {
        item.meta = item.meta || {}
        return item.meta.roles ? item.meta.roles.includes(this.roles) : true
      },
      validatenull (val) {
        return validatenull(val)
      },
      open (item) {
        if (this.screen <= 1) this.$store.commit('SET_COLLAPSE')

        // console.log(item[this.pathKey])
        // console.log(item)
        // debugger

        this.$router.$avueRouter.group = item.group
        this.$router.$avueRouter.meta = item.meta

        let path = this.$router.$avueRouter.getPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }, item.meta)

        if (path.indexOf('apps') != -1) {
          history.pushState({}, item.name, path)
        } else {
          console.log(this.$router.$avueRouter)
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: item[this.labelKey],
              src: item[this.pathKey]
            }, item.meta),
            query: item.query
          })
        }
      }
    }
  }
</script>
