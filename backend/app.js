const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    image: String, // Store the filename of the uploaded image
});

const Item = mongoose.model('Item', itemSchema);

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
    },
});

const upload = multer({ storage: storage });

// CRUD routes
app.post('/items', upload.single('image'), async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            image: req.file ? req.file.filename : null, // Save the filename in the database
        });
        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).send(error.message);
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send(error.message);
    }
});

app.put('/items/:id', upload.single('image'), async (req, res) => {
    try {
        const updatedData = {
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            image: req.file ? req.file.filename : undefined, // Update the image if a new one is provided
        };
        const item = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.send(item);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).send(error.message);
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// // const bodyParser = require('body-parser');
// const User = require('./model/usermodel.js');
// // Connect to MongoDB
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/crud', { useNewUrlParser: true, useUnifiedTopology: true });

// // Define the schema
// const itemSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     gender: String
// });

// const Item = mongoose.model('Item', itemSchema);

// // CRUD routes
// app.post('/items', async (req, res) => {
//     const newItem = new Item(req.body);
//     await newItem.save();
//     res.status(201).send(newItem);
// });

// app.get('/items', async (req, res) => {
//     const items = await Item.find();
//     res.send(items);
// });

// app.put('/items/:id', async (req, res) => {
//     const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.send(item);
// });

// app.delete('/items/:id', async (req, res) => {
//     await Item.findByIdAndDelete(req.params.id);
//     res.status(204).send();
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });




// // Create a new user
// app.post('/users', async (req, res) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json({
//             message: "User created successfully",
//             data: user
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Server error: " + err.message });
//     }
// });

// // Read all users
// app.get('/users', async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Read a single user by ID
// app.get('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (user) {
//             res.status(200).json(user);
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Update a user by ID
// app.put('/users/:id', async (req, res) => {
//     try {
//         const [updated] = await User.update(req.body, {
//             where: { id: req.params.id }
//         });
//         if (updated) {
//             const updatedUser = await User.findByPk(req.params.id);
//             res.status(200).json(updatedUser);
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Delete a user by ID
// app.delete('/users/:id', async (req, res) => {
//     try {
//         const deleted = await User.destroy({
//             where: { id: req.params.id }
//         });
//         if (deleted) {
//             res.status(200).json({ message: 'User deleted' });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



// At the top of your app.js
// const sequelize = require('./database');

// // Before starting the server
// sequelize.sync().then(() => {
//     console.log('Database & tables created!');
// }).catch(err => {
//     console.error('Error syncing database:', err);
// });



// model/usermodel.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../database');

// const User = sequelize.define('User', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     // Add more fields as necessary
// });

// module.exports = User;


// database.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('crud_db', 'username', 'password', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

// module.exports = sequelize;
