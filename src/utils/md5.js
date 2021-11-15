import SparkMD5 from 'spark-md5'

/**
 * 获取文件MD5
 * @param file 文件
 * @param size 文件大小
 * @param call 回调函数
 */
export function md5(file) {
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const fileReader = new FileReader()
  const chunkSize = 5 * 1024 * 1024
  const size = file.size
  const chunks = Math.ceil(size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  return new Promise(function(resolve, reject) {
    fileReader.onload = function(e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        const fileMd5 = spark.end()
        resolve(fileMd5)
      }
    }
    fileReader.onerror = function() {
      reject('数据都是不大于5')
    }
    function loadNext() {
      const start = currentChunk * chunkSize
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
  })
}
