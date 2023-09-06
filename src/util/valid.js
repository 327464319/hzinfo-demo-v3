/**
 * input禁止输入规则
 */
// eslint-disable-next-line prefer-regex-literals
const pattern = new RegExp('[`~^*|{}\\[\\]<>￥……*|‘”“]')// 这些字段不允许输入
// eslint-disable-next-line prefer-regex-literals
const patternAllow = new RegExp('[`~^*|\\[\\]<>￥……*|‘”“]')// 这些字段不允许输入
// eslint-disable-next-line prefer-regex-literals
const patternAllowStar = new RegExp('[`~{}\\[\\]<>￥……‘”“]')// 这些字段不允许输入

export function testMark (s) {
 return pattern.test(s)
}

export function allowMark (s) {
 return patternAllow.test(s)
}

export function allowStarMark (s) {
 return patternAllowStar.test(s)
}

export function replaceMark (s, isOutSpace) {
  let rs = ''
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '')
    rs = rs.replace('-', '')
    // rs = rs.replace('\\', '');
    if (!isOutSpace) {
      rs = rs.replace(' ', '')
    }
  }
  return rs
}

export function timeReplaceMark (obj) {
  // 允许输入框输入{} '' 条件判断
  let attributesAllow = obj.attributes['allow-input']
  let attributesAllowStar = obj.attributes['allow-star']
  if (attributesAllow && attributesAllow.value == 'true') {
    if (allowMark(obj.value)) obj.value = replaceMark(obj.value, true)
  } else if (attributesAllowStar && attributesAllowStar.value == 'true') {
    if (allowStarMark(obj.value)) obj.value = replaceMark(obj.value, true)
  } else {
    if (testMark(obj.value)) {
      obj.value = replaceMark(obj.value, true)
    } else if (/'/.test(obj.value)) {
      const tempValue = obj.value.replace(/'/gi, '')
      if (tempValue == '') {
        // 如果全是''，代表不是输入词语，可以替换
        obj.value = tempValue
      }
    } else if (/"/.test(obj.value)) {
      const tempValue = obj.value.replace(/"/gi, '')
      if (tempValue == '') { // 如果全是''，代表不是输入词语，可以替换
        obj.value = tempValue
      }
    }
  }
}
