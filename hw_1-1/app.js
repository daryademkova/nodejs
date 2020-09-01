import program from './utils/commander'
import { statFile, createDir, rmdirRecursive } from './utils/file-handler'
import { handleError } from './utils/error-handler'
import { sort } from './methods/sort'

process
  .on('unhandledRejection', (err, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', err)
    handleError({
      message: err,
      status: 'error',
    })
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    handleError({
      message: err,
      status: 'error',
    })
  })

program.parse(process.argv)
;(async () =>
  await statFile(program.folder)
    .then((res) => {
      if (!res.isDirectory()) {
        handleError({
          message: `${program.folder} is NOT directory!`,
          status: 'error',
        })
      }
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        err = `Directory ${program.folder} do not exists!`
      }
      handleError({
        message: err,
        status: 'error',
      })
    }))()
  .then(() => createDir(program.output))
  .then(
    sort(program.folder, program.output).then(() => {
      console.log('Sorting done!')
      if (program.delete) {
        console.log(`Removing ${program.folder} recursively...`)
        rmdirRecursive(program.folder).then(() =>
          console.log(`Removing ${program.folder} done!`)
        )
      }
    })
  )
