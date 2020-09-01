import commander from 'commander'
const { program } = commander

export default program
  .version('0.0.1')
  .requiredOption('-f, --folder <src>', 'Input source folder')
  .option(
    '-o, --output [dst]',
    'Input output folder (default: "./dist")',
    './dist'
  )
  .option('-d, --delete', 'Delete source folder')
