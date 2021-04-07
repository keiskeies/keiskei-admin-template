export default function downloadExcel(response) {
  if (!response) {
    return
  }
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', response.headers['file-name'] || new Date().getTime() + '.xls')
  document.body.appendChild(link)
  link.click()
}
