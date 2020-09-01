import * as http from 'http'
const PORT = process.env.PORT || 3000
const INTERVAL = process.env.INTERVAL || 1
const TIMEOUT = process.env.TIMEOUT || 5

const requestHandler = (request, response) => {
  // const { headers, method, url } = request
  // let body = []

  response
    .on('error', (err) => {
      console.error(err)
    })
    .on('close', () => {
      console.log('Connection closed')
    })
    .on('end', () => {
      if (!response.complete) {
        console.error(
          'The connection was terminated while the message was still being sent'
        )
      }
    })

  console.log('Creating interval')
  const reqInterval = setInterval(() => {
    console.log(new Date().toUTCString())
  }, INTERVAL * 1000)

  const resTimeout = setTimeout(() => {
    console.log('Clearing interval')
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(new Date().toUTCString())
    response.end()
    clearInterval(reqInterval)
  }, TIMEOUT * 1000)

  request
    .on('error', (err) => {
      console.error(err)
    })
    // .on('data', (chunk) => {
    //   body.push(chunk)
    // })
    // body = Buffer.concat(body).toString()
    .on('end', () => {
      // response.statusCode = 200
      // response.setHeader('Content-Type', 'application/json')
      // const responseBody = { headers, method, url, body }
      // response.write(JSON.stringify(responseBody))
      // response.end()
    })
}

const server = http.createServer(requestHandler)
server.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log(`Server is listening on port ${PORT}`)
})
