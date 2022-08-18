import { FormInstance } from 'element-plus'
/**
 * @desc 下载文件
 * @param res 数据流
 * @param name 下载文件名称（携带文件格式后缀）
 */
export const downloadFile = (res:any, name:string) => {
  let url = window.URL.createObjectURL(new Blob([res]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('id', 'downloadLink')
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  // 删除添加的a标签
  let objLink = document.getElementById('downloadLink')
  document.body.removeChild(objLink as HTMLElement)
}

/**
 * @desc 对表单的单个属性进行校验
 * @param ruleFormRef 表单的refs
 * @param validateFileName 校验的属性名称
 */
export const validateField = (ruleFormRef:FormInstance, validateFileName:string) => {
  ruleFormRef?.validateField(validateFileName, (error) => {
    if (!error) {
      console.log('单独校验未通过')
      return false
    }
  })
}
