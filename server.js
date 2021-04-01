const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://khorally:pierre@cluster0.kr02r.mongodb.net/todo?retryWrites=true&w=majority";
const dbName = "todo";

app.listen(3300, () => {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log('rendering task items')
    res.render('index.ejs', {
      tasks: result
    })
  })
})

app.post('/tasks', (req, res) => {
  db.collection('tasks').insertOne({
    task: req.body.task,
    completed: false
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// put = update
app.put('/crossOut', (req, res) => {
  console.log(req.body)
  db.collection('tasks')
    .findOneAndUpdate({
      task: req.body.task,
      completed: req.body.completed
    }, {
      $set: {
        completed: ((req.body.completed) ? false : true)
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/singleTasks', (req, res) => {
  db.collection('tasks').findOneAndDelete({task: req.body.task}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Task deleted!')
  })
})

// delete
app.delete('/clearAll', (req, res) => {
  db.collection('tasks').deleteMany({})
  res.send('tasks cleared')
})

app.delete('/clearCompleted', (req, res) => {
  db.collection('tasks').deleteMany({
    completed: true
  })
  res.send('tasks cleared')
})
