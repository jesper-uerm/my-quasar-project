const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist_quasardb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Todolist API!",
    status: "Running"
  });
});

app.get('/tbl_tasks', async (req, res) => {
  try {
    const [rows] = await dbPool.query("SELECT * FROM tbl_tasks ORDER BY id DESC");
    const tasks = rows.map(task => ({
      ...task,
      is_done: !!task.is_done
    }));
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/tbl_tasks/count', async (req, res) => {
  try {
  const [rows] = await dbPool.query("SELECT COUNT(*) as totalCount FROM tbl_tasks");
  res.json({ count: rows[0].totalCount });

  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Database error' });
  }
});

app.get('/tbl_tasks/counts', async (req, res) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM tbl_tasks WHERE is_done = 0 OR is_done IS NULL) AS incompleteCount,
        (SELECT COUNT(*) FROM tbl_tasks WHERE is_done = 1) AS completedCount
  `;
  const [rows] = await dbPool.query(query);

  res.json({
      incomplete: rows[0].incompleteCount,
      completed: rows[0].completedCount
    });

  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Database error' });
  }
});

app.post('/tbl_tasks', async (req, res) => {
  const { taskName, dueDate} = req.body;
  if (!taskName) {
    return res.status(400).json({ error: 'taskName is required' });
  }

  const newDueDate = dueDate ? dueDate : null;

  try {
    const [result] = await dbPool.query(
      "INSERT INTO tbl_tasks (taskName, is_done, dueDate) VALUES (?, ?, ?)",
      [taskName, false, newDueDate]
    );

    const newTask = {
      id: result.insertId,
      taskName: taskName,
      is_done: false,
      dueDate: newDueDate
    };
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/tbl_tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { taskName, is_done, dueDate } = req.body;
  const isDoneBoolean = !!is_done;

  let dateCompletedValue;
  if (isDoneBoolean === true) {
    dateCompletedValue = new Date();
  } else {
    dateCompletedValue = null;
  }

  const newDueDate = dueDate ? dueDate : null;

  try {
    await dbPool.query(
      "UPDATE tbl_tasks SET taskName = ?, is_done = ?, dueDate = ?, date_completed = ? WHERE id = ?",
      [taskName, isDoneBoolean, newDueDate,  dateCompletedValue, id]
    );
    res.json({
      id: parseInt(id, 10),
      taskName,
      is_done: isDoneBoolean,
      date_completed: dateCompletedValue,
      dueDate: newDueDate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/tbl_tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbPool.query("DELETE FROM tbl_tasks WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
