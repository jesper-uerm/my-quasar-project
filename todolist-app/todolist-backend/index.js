const express = require('express')
const sql = require('mssql')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const config = {
  user: '9580',
  password: 'uerm@9580',
  server: '20.14.20.196',
  database: 'todolist_quasardb',

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

let pool

async function startApp() {
  try {
    pool = await sql.connect(config)
    console.log('Connected to SQL Server')

    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Failed to connect to Database:', err)
  }
}

startApp()

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Todolist API!',
    status: 'Running',
  })
})

app.get('/tbl_tasks', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM tbl_tasks ORDER BY id DESC')
    const tasks = result.recordset.map((task) => ({
      ...task,
      isDone: !!task.isDone,
    }))

    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/tbl_tasks/count', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT COUNT(*) as totalCount FROM tbl_tasks')
    res.json({ count: result.recordset[0].totalCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/tbl_tasks/counts', async (req, res) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM tbl_tasks WHERE isDone = 0 OR isDone IS NULL) AS incompleteCount,
        (SELECT COUNT(*) FROM tbl_tasks WHERE isDone = 1) AS completedCount
  `
    const result = await pool.request().query(query)
    const counts = result.recordset[0]

    res.json({
      incomplete: counts.incompleteCount,
      completed: counts.completedCount,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.post('/tbl_tasks', async (req, res) => {
  const { taskName, dueDate } = req.body

  if (!taskName) {
    return res.status(400).json({ error: 'taskName is required' })
  }

  const newDueDate = dueDate ? dueDate : null

  try {
    const result = await pool
      .request()
      .input('taskName', sql.VarChar, taskName)
      .input('dueDate', sql.Date, newDueDate).query(`
        INSERT INTO tbl_tasks (taskName, isDone, dueDate)
        VALUES (@taskName, 0, @dueDate);
        SELECT SCOPE_IDENTITY() AS id
      `)

    const newId = result.recordset[0].id

    const newTask = {
      id: newId,
      taskName: taskName,
      isDone: false,
      dueDate: newDueDate,
    }
    res.status(201).json(newTask)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.put('/tbl_tasks/:id', async (req, res) => {
  const { id } = req.params
  const { taskName, isDone, dueDate } = req.body
  const isDoneBoolean = !!isDone

  let dateCompletedValue
  if (isDoneBoolean === true) {
    dateCompletedValue = new Date()
  } else {
    dateCompletedValue = null
  }

  const newDueDate = dueDate ? dueDate : null

  try {
    await pool
      .request()
      .input('taskName', sql.VarChar, taskName)
      .input('isDone', sql.Bit, isDoneBoolean)
      .input('dueDate', sql.Date, newDueDate)
      .input('dateCompletedValue', sql.Date, dateCompletedValue)
      .input('id', sql.Int, id)
      .query(
        'UPDATE tbl_tasks SET taskName = @taskName, isDone = @isDone, dueDate = @dueDate, dateCompleted = @dateCompletedValue WHERE id = @id',
      )

    res.json({
      id: parseInt(id, 10),
      taskName,
      isDone: isDoneBoolean,
      dateCompleted: dateCompletedValue,
      dueDate: newDueDate,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.delete('/tbl_tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    await pool.request().input('id', sql.Int, id).query('DELETE FROM tbl_tasks WHERE id = @id')

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`)
})
