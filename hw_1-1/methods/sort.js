import { readDir, copyFile, createDir } from '../utils/file-handler'
import * as path from 'path'

async function* getFiles(base) {
  const files = await readDir(base)
  for await (const file of files) {
    const res = path.join(base, file.name)
    if (file.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield { base: base, name: file.name }
    }
  }
}

export const sort = async (base, dest) => {
  for await (const f of getFiles(base)) {
    const fileSrc = path.join(f.base, f.name)
    const fileDest = path.join(dest, f.name[0].toUpperCase(), f.name)
    const dirDest = path.join(dest, f.name[0].toUpperCase())
    await createDir(dirDest).then(
      async () =>
        await copyFile(fileSrc, fileDest).then(() =>
          console.log(`${fileDest} copy done!`)
        )
    )
  }
}
