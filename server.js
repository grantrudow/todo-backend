const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', todoRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
	useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
	console.log('MongoDB database connection established successfully')
})

todoRoutes.route('/').get(function(req, res) {
	Todo.find(function(err, todos) {
		if (err) {
			console.log(err);
		} else {
			res.json(todos);
		}
	})
})

app.listen(PORT, function() {
	console.log('Server is running on PORT: ' + PORT)
})