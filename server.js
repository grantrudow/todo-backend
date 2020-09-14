const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/todos', {
	useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
	console.log('MongoDB database connection established successfully')
})

// Deliver all available todos
todoRoutes.route('/').get(function(req, res) {
	Todo.find(function(err, todos) {
		if (err) {
			console.log(err);
		} else {
			res.json(todos);
		}
	})
})

// Retrieve specifc todo by ID
todoRoutes.route('/:id').get((req, res) => {
	let id = req.params.id;
	Todo.findById(id, (err, todo) => {
		res.json(todo);
	})
})

// Add new todo
todoRoutes.route('/add').post((req, res) => {
	let todo = new Todo(req.body);
	todo.save()
		.then(todo => {
			res.status(200).json({
				'todo': 'todo added successfully'
			});
		})
		.catch(err => {
			res.status(400).send('Adding new todo failed');
		});
});

// Update a todo at a specific ID
todoRoutes.route('/update/:id').post((req, res) => {
	Todo.findById(req.params.id, (err, todo) => {
		if (!todo) {
			res.status(400).send('Data is not found');
		} else {
			todo.todo_description = req.body.todo_description;
			todo.todo_responsible = req.body.todo_responsible;
			todo.todo_completed = req.body.todo_completed;

			todo.save().then(todo => {
				res.json('Todo updated!');
			})
			.catch(err => {
				res.status(400).send('Update not possible')
			})
		}
	})
})

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
	console.log('Server is running on PORT: ' + PORT)
})