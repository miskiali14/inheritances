const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const User = require('./models/user'); // Adjust the path as needed
const InheritanceResult = require('./models/InheritanceResult');

const app = express();
const PORT = 5000;

const mongoUri = 'mongodb+srv://miskiali:4LTPbiZ9esPJIdCE@cluster0.htk0o0h.mongodb.net/inheritance?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());


// User Registration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// User Registration
app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const image = req.file ? req.file.path : null;
    const user = new User({ name, email, password, gender, image });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send({ error: 'Error registering user', details: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    // Add token logic here if necessary
    res.status(200).send(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send({ error: 'Error logging in user', details: error.message });
  }
});

app.put('/update-profile', upload.single('image'), async (req, res) => {
  try {
    const { userId, name, email, gender } = req.body;
    const image = req.file ? req.file.path : null;
    const updatedData = { name, email, gender };
    if (image) {
      updatedData.image = image;
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).send(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).send({ error: 'Error updating profile', details: error.message });
  }
});


// Get All Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ error: 'Error fetching users', details: error.message });
  }
});

// Get User by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ error: 'Error fetching user', details: error.message });
  }
});

// Delete User
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Error deleting user', details: error.message });
  }
});


// Create Inheritance Result
app.post('/results', async (req, res) => {
  try {
    const { email, result } = req.body;
    const inheritanceResult = new InheritanceResult({ email, result });
    await inheritanceResult.save();
    res.status(201).send(inheritanceResult);
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(400).send({ error: 'Error saving result', details: error.message });
  }
});

// Get Results

// Route to get results by email
app.get('/results', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ error: 'Email query parameter is required' });
  }

  try {
    const results = await InheritanceResult.find({email});
    res.status(200).send(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).send({ error: 'Error fetching results', details: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});




