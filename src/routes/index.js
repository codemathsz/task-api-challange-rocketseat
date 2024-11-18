import { Database } from "../data/db.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "../utils/route-parameters-regex.js"

const dataBase = new Database

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req,res) =>{
      const { title, description } = req.body
      if(!title && !description) return res.writeHead(400).end('Bad Request: missing title or description')
      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: null
      }
      dataBase.insert('tasks', task)
      res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req,res) =>{
      return res.writeHead(200).end(JSON.stringify(dataBase.select('tasks')))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) =>{
      const { title, description } = req.body
      const { id } = req.params

      if(!title && !description) return res.writeHead(400).end('Bad Request: missing title or description')
      const result = dataBase.update('tasks', {title, description}, id)
      if(!result){
        return res.writeHead(400).end('Bad Request: Task not found with `id`')
      }else{
        return res.writeHead(204).end()
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) =>{
      const { id } = req.params
      const result = dataBase.delete('tasks', id)
      if(!result){
        return res.writeHead(400).end('Bad Request: Task not found with `id`')
      }else{
        return res.writeHead(204).end()
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req,res) =>{
      const { id } = req.params
      const result = dataBase.changeStatus('tasks', id)
      if(!result){
        return res.writeHead(400).end('Bad Request: Task not found with `id`')
      }else{
        return res.writeHead(204).end()
      }
    }
  }
]