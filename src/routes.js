import { buildRoutePath } from "./utils/build-route-paths.js"
import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { csvImporter } from "./streams/csv-importer.js"

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)
      return res.writeHead(201).end()

    }
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks', req.query)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id
      // check if task exists
      const task = database.select('tasks', { id })

      if (!task || task.length === 0) {
        return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Task not found')
      } else {
        database.delete('tasks', id)
        return res.writeHead(204).end()
      }

    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id
      let { title, description } = req.body

      const taskOld = database.get('tasks', id)

      // check if task exists
      if (!taskOld || taskOld.length === 0) {
        return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Task not found')
      }

      //check if body has title and description, if not, maintain the old values
      title = req.body.title || taskOld.title;
      description = req.body.description || taskOld.description;


      let created_at = taskOld.created_at
      let completed_at = taskOld.completed_at

      database.update('tasks', id, { title, description, created_at, completed_at, updated_at: new Date() })

      return res.writeHead(204).end()
    }
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      // get id from params
      const id = req.params.id
      // get task from database
      const task = database.get('tasks', id)

      // check if task exists
      if (!task || task.length === 0) {
        return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Task not found')
      }

      // update only the completed_at field
      database.update('tasks', id, { ...task, completed_at: new Date(), updated_at: new Date() })

      return res.writeHead(204).end()
    }
  },

  //get csv file
  {
    method: 'GET',
    path: buildRoutePath('/csv'),
    handler: (req, res) => {
      csvImporter()
      return res.writeHead(200).end()
    }
  }

]
