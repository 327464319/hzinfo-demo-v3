import {setStore, getStore} from '@/util/store'
import {diff} from '@/util/util'
import website from '@/config/website'
import {defineStore} from 'pinia'
const isFirstPage = website.isFirstPage
const tagWel = website.fistPage
const tagObj = {
  label: '', // 标题名称
  value: '', // 标题的路径
  params: '', // 标题的路径参数
  query: '', // 标题的参数
  meta: {}, // 额外参数
  group: [] // 分组
}

// 处理首个标签
function setFistTag (list) {
  if (list.length === 1) {
    list[0].close = false
  } else {
    list.forEach((ele) => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}

export const useNavsStore = defineStore('navs', {
  state: {
    tagList: getStore({name: 'tagList'}) || [],
    tag: getStore({name: 'tag'}) || tagObj,
    tagWel
  },
  actions: {
    ADD_TAG: (action) => {
      this.tag = action
      setStore({name: 'tag', content: this.tag})
      if (this.tagList.some((ele) => diff(ele, action))) return
      this.tagList.push(action)
      setFistTag(this.tagList)
      setStore({name: 'tagList', content: this.tagList})
    },
    DEL_TAG: (action) => {
      this.tagList = this.tagList.filter((item) => {
        return !diff(item, action)
      })
      setFistTag(this.tagList)
      setStore({name: 'tagList', content: this.tagList})
    },
    DEL_ALL_TAG: () => {
      this.tagList = [this.tagWel]
      setStore({name: 'tagList', content: this.tagList})
    },
    DEL_TAG_OTHER: () => {
      this.tagList = this.tagList.filter((item) => {
        if (item.value === this.tag.value) {
          return true
        } else if (!website.isFirstPage && item.value === website.fistPage.value) {
          return true
        }
      })
      setFistTag(this.tagList)
      setStore({name: 'tagList', content: this.tagList})
    },
    SET_TAG_LIST (tagList) {
      this.tagList = tagList
      setStore({name: 'tagList', content: this.tagList})
    }
  }
})
