import * as fs from 'fs/promises'
import { handleError } from './error-handler'

export const statFile = async (path) => {
  return await fs.lstat(path)
}

export const createDir = async (path) => {
  return await statFile(path)
    .then((res) => {
      if (!res.isDirectory()) {
        handleError({
          message: `File ${path} already exists and is NOT directory!`,
          status: 'error',
        })
      }
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        fs.mkdir(path, { recursive: true })
      } else {
        handleError({
          message: err,
          status: 'error',
        })
      }
    })
}

export const readDir = async (base) => {
  return await fs.readdir(base, { withFileTypes: true }).catch((err) => {
    handleError({
      message: `Failed to read ${base} directory with error: ${err}`,
      status: 'error',
    })
  })
}

export const renameFile = async (path, newPath, cb = () => null) => {
  return await fs.rename(path, newPath, cb).catch((err) => {
    handleError({
      message: `Failed to rename ${path} to ${newPath} with error: ${err}`,
      status: 'error',
    })
  })
}

export const copyFile = async (path, newPath, cb = () => null) => {
  return await fs.copyFile(path, newPath, 0, cb).catch((err) => {
    handleError({
      message: `Failed to copy ${path} to ${newPath} with error: ${err}`,
      status: 'error',
    })
  })
}

export const rmdirRecursive = async (path, cb = () => null) => {
  return await fs
    .rmdir(path, { maxRetries: 5, recursive: true, retryDelay: 500 }, cb)
    .catch((err) => {
      handleError({
        message: `Failed to delete directory with error: ${err}`,
        status: 'error',
      })
    })
}
