/**
 * 获取文件MD5
 * @param list
 * @param parentId
 */
export function treeFind(data, parentId) {
  const result = []
  return new Promise(function(resolve, reject) {
    function loadNext(list) {
      list.forEach(e => {
        if (e.parentId === parentId) {
          result.push(e)
        }
        if (e.children) {
          loadNext(e.children)
        }
      })
    }

    loadNext(data)
    resolve(result)
  })
}
