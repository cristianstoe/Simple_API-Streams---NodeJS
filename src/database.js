import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    })
      .catch(() => {
        this.#persist()
      })
  }
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  get(table, id) {
    if (id) {
      return this.#database[table]?.find(row => row.id === id)
    }

    return this.#database[table]
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search && Object.keys(search).length > 0) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }


    return data
  }

  delete(table, id) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table] = this.#database[table].filter(row => row.id !== id)
    }

    this.#persist()
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }

}
