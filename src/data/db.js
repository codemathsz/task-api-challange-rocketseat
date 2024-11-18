import fs from 'node:fs/promises'

const dataBasePath = new URL('db.json', import.meta.url)

export class Database{
  #database = {}

  constructor(){
    fs.readFile(dataBasePath, 'utf-8').then(data =>{
      this.#database = JSON.parse(data)
    })
    .catch(() =>{
      this.#persist() // criar o arquivo vazio, para quando chamarmos existir
    })
  }

  #persist(){
    fs.writeFile(dataBasePath, JSON.stringify(this.#database))
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    }else{
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }

  select(table){
    return this.#database[table] ?? []
  }
  
  getTaskById(table,id){
    return this.#database[table].findIndex(row => row.id === id)
  }

  update(table, data, id){
    if(!this.#database[table]) return
    const rowIndex = this.getTaskById(table,id)
    if(rowIndex === -1) return false

    if(data.title) this.#database[table][rowIndex].title = data.title
    if(data.description) this.#database[table][rowIndex].description = data.description
    this.#database[table][rowIndex].updatedAt = new Date()
    this.#persist()
    return true
  }

  delete(table, id){
    const rowIndex = this.getTaskById(table,id)
    if(rowIndex === -1) return false

    this.#database[table].splice(rowIndex, 1)
    this.#persist()
    return true
  }

  changeStatus(table,id){
    const rowIndex = this.getTaskById(table, id)
    if(rowIndex === -1) return false

    if(!this.#database[table][rowIndex].completedAt){
      this.#database[table][rowIndex].completedAt = new Date()
    }else{
      this.#database[table][rowIndex].completedAt = null
    }
    this.#persist()
    return true
  }
}