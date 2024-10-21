import { reactive } from "vue"

// 默认分页数据接口
interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[] // 可选的每页显示条数数组
  pageSize: number // 当前每页显示的条数
  layout: string
}

// 可选的分页数据接口
interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 默认的分页参数 */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** 合并分页参数 */
  // 对象展开运算符...将defaultPaginationData和initialPaginationData合并，后者的属性会覆盖前者相同的属性
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** 改变当前页码 */
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  /** 改变页面大小 */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
