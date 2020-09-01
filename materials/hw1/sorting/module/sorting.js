import * as fs from 'fs' // 'fs/promises'  require('fs').promises
import * as path from 'path'
import { handleError } from '../utils/handle-error'
import createFolderIsNotExist from '../utils/createFolder'

const criteriaExtFile = (file) => {
  const folder = path.extname(file.path)
  const targetPath = path.join(file.dist, folder)
  return targetPath
}

const criteriaAlphabetFile = (file) => {
  const indexLetter = 0
  const folder = file.name[indexLetter].toLowerCase()
  const targetPath = path.join(file.dist, folder)
  return targetPath
}

const criteriaForDir = (file) => {
  switch (file.criteria) {
    case 0:
      return criteriaExtFile(file)
    default:
      return criteriaAlphabetFile(file)
  }
}

const copyFile = (file, cb) => {
  const dir = criteriaForDir(file)
  createFolderIsNotExist(dir)
  fs.copyFile(file.path, path.join(dir, file.name), (err) => {
    if (err) {
      return handleError(err)
    }
    cb()
  })
}

const sort = (dist, watcher, criteria = 1) => {
  watcher.started()
  const readFolder = (base) => {
    watcher.startProccess(base)
    fs.readdir(base, (err, files) => {
      if (err) {
        handleError(err)
        return
      }
      for (const item of files) {
        const localBase = path.join(base, item)
        const state = fs.statSync(localBase)
        if (state.isDirectory()) {
          readFolder(localBase)
        } else {
          watcher.startProccess(localBase)
          copyFile({ dist, criteria, name: item, path: localBase }, () => {
            watcher.endProccess(localBase)
          })
        }
      }
      watcher.endProccess(base)
    })
  }
  return readFolder
}

export default sort
