// 禁止输入特殊字符
export const disableSynmolDirective = (app:any) => {
  app.directive('disableSynmolDirective', {
    mounted (el:any) {
      // 正则规则可根据需求自定义
      let regRule = /[~.`!！@#$￥%^*\s.。，,’'":：“|、\\/（）()【】{}？?&<>《》+=_-]/g
      // 查找 input 输入框元素
      let $inp = findEle(el, 'input')
      // 没有input输入框时查找 textarea 编辑框
      if (!$inp) $inp = findEle(el, 'textarea')
      // 两个都没有就返回 防止报错
      if (!$inp) return
      el.$inp = $inp
      // 事件回调处理
      $inp.handle = function () {
        let val = $inp.value
        $inp.value = val.replace(regRule, '')
        // trigger($inp, 'input')
      }
      $inp.addEventListener('input', $inp.handle)
      // $inp.addEventListener('keydown', $inp.handle)
    },
    unmounted (el:any) {
      el.$inp.removeEventListener('input', el.$inp.handle)
      // el.$inp.removeEventListener('keydown', el.$inp.handle)
    }
  })
}
// 查找指定dom元素
const findEle = (parent:any, type:string) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
}
// 手动触发事件，该操作可防止输入完特殊字符快速回车时没有去除掉特殊字符的情况
// const trigger = (el:any, type:string) => {
//   const e = document.createEvent('HTMLEvents')
//   e.initEvent(type, true, true)
//   el.dispatchEvent()
// }
