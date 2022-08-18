import { ref } from 'vue'
export default function () {
  let currentPage = ref('1')
  let pageSize = ref('10')
  let total = ref(0)
  const handleSizeChange = (callback?:any) => {
    callback?.()
  }
  const handleCurrentChange = (callback?:any) => {
    callback?.()
  }
  return {
    currentPage,
    pageSize,
    total,
    handleSizeChange,
    handleCurrentChange
  }
}
