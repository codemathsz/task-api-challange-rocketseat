import http from 'node:http'
import { BodyReq } from './middlewares/get-body-req.js'
import { routes } from './routes/index.js'


const port = 3333
const server = http.createServer(async(req,res) =>{
  const { method, url } = req

  await BodyReq(req,res)
  
  const route = routes.find((route) =>{
    return route.method === method && route.path.test(url)
  })

  if(route){
    req.params = req.url.match(route.path).groups
    return route.handler(req,res)
  }
  
  return res.writeHead(404).end('Not Found')
})

server.listen(port, () =>{
  console.log(`server start in: http://localhost:${port}`);
})