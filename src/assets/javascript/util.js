export function valueToLabel (id, data) {
  if (data) {
    let item = data.filter(item => {
      return item.value === Number(id)
    })
    return item.length > 0 ? item[0].label : ''
  }
  return ''
}

export function param (data) {
  let url = ''
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      if (((typeof data[k] === 'string' || typeof data[k] === 'number') && data[k] !== '') || (data[k] instanceof Array && data[k].length > 0)) {
        let value = data[k] !== undefined ? data[k] : ''
        if (data[k] instanceof Array) {
          data[k].forEach((item, index) => {
            url += '&' + k + '[]=' + encodeURIComponent(item)
          })
        } else {
          url += '&' + k + '=' + encodeURIComponent(value)
        }
      }
    }
  }
  return url ? url.substring(1) : ''
}

export function fileDownload (data, fileName) {
  let blob = new Blob([data], {
    type: 'application/octet-stream'
  })
  let filename = fileName || 'filename.xls'
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    let blobURL = window.URL.createObjectURL(blob)
    let tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}
