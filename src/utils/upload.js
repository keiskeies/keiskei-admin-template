import { uploadPart, mergingChunks, exist } from '@/api/upload'
import { md5 as getMd5 } from '@/utils/md5'

/**
 * 分片上传函数
 * @param file 文件
 * @param progress 进度条回调
 * @param success 成功回调
 * @param error 失败回调
 */
export function uploadByPieces({ file, progress, success, error }) {
  // 获取文件MD5
  getMd5(file).then(res => {
    const fileMd5 = res
    // 判断文件是否存在
    const fileName = file.name
    const suffix = fileName.substr(fileName.indexOf('.'))
    exist(fileMd5 + suffix).then(res => {
      if (res.data) {
        success(res)
      } else {
        // 文件大小
        const fileSize = file.size
        // 分片最小单位
        const chunkSize = 5 * 1024 * 1024

        // 上传过程中用到的变量
        let progressNum = 0 // 进度
        let successAllCount = 0 // 上传成功的片数
        let AllChunk = 0 // 所有文件的chunk数之和
        let chunkCount // chunk数量
        let token // 文件唯一标识

        const readChunk = () => {
          token = guid()
          chunkCount = Math.ceil(fileSize / chunkSize) // 总片数
          AllChunk = AllChunk + chunkCount // 计算全局chunk数
          for (let i = 0; i < chunkCount; i++) {
            uploadChunk(i)// 针对单个文件进行chunk上传
          }
        }
        const uploadChunk = (index) => {
          const { chunk } = getChunkInfo(file, index, chunkSize)
          const chunkFR = new FileReader()
          chunkFR.readAsBinaryString(chunk)
          chunkFR.addEventListener('load', () => {
            const fetchForm = new FormData()
            fetchForm.append('id', token)
            fetchForm.append('name', file.name)
            fetchForm.append('size', fileSize)
            fetchForm.append('md5', fileMd5)
            fetchForm.append('file', chunk)
            fetchForm.append('chunks', chunkCount)
            fetchForm.append('chunk', index)
            uploadPart(fetchForm).then(() => {
              successAllCount++
              progressFun()
              // 当总数大于等于分片个数的时候合并文件
              if (successAllCount >= chunkCount) {
                mergingFile()
              }
              // successAllCount >= chunkCount ? mergingFile() : uploadChunk(successAllCount)
            }).catch((e) => {
              error && error(e)
            })
          }, false)
        }

        // 对分片已经处理完毕的文件进行上传
        const mergingFile = () => {
          const makeFileForm = new FormData()
          makeFileForm.append('id', token)
          makeFileForm.append('name', file.name)
          makeFileForm.append('md5', fileMd5)
          makeFileForm.append('chunks', chunkCount)
          mergingChunks(makeFileForm).then(res => {
            success && success(res)
          }).catch(e => {
            error && error(e)
          })
        }
        // 截取文件信息
        const getChunkInfo = (file, currentChunk, chunkSize) => {
          const start = currentChunk * chunkSize
          const end = Math.min(fileSize, start + chunkSize)
          const chunk = file.slice(start, end)
          return { start, end, chunk }
        }
        // 获取唯一文件标识
        const guid = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 32 | 0
            const v = c === 'x' ? (Math.random() * 32 | 0) : (r & 0x1 | 0x32)
            return v.toString(32)
          })
        }
        // 更新进度
        const progressFun = () => {
          progressNum = Math.ceil(successAllCount / AllChunk * 100)
          progress(progressNum)
        }
        readChunk() // 开始执行代码
      }
    })
  }).catch(e => {
    error && error(e)
  })
}
