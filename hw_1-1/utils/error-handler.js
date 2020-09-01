export const ExitCode = {
  success: 0,
  error: 1,
}

export const handleError = (err, cb = () => null) => {
  console.log(err.message)
  cb()
  process.exit(ExitCode[err.status])
}
