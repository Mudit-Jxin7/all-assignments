const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  const findAdmin = ADMINS.find(admin => admin.username === username);
  if (findAdmin) {
    res.status(400).send('Already Exists!');
  } else {
    ADMINS.push({ username: username, password: password });
    res.status(200).send('Admin created successfully');
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const findAdmin = ADMINS.find(admin => admin.username === username);
  if (findAdmin && findAdmin.password === password) {
    res.status(200).send('Logged in successfully');
  } else {
    res.status(400).send('Invalid Credentials');
  }
});

let id = 1;

app.post('/admin/courses', (req, res) => {
  const { username, password } = req.headers;
  const findAdmin = ADMINS.find(admin => admin.username === username);
  if (findAdmin && findAdmin.password === password) {

    const { title, description, price, imageLink } = req.body;
    COURSES.push({
      id: id,
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
      published: true,
    });

    id = id + 1;
    res.status(200).json(COURSES);

  } else {
    res.status(400).send('Invalid Credentials');
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  const { username, password } = req.headers;
  const findAdmin = ADMINS.find(admin => admin.username === username);
  if (findAdmin && findAdmin.password === password) {
    const { title, description, price, imageLink } = req.body;
    const courseId = parseInt(req.params.courseId);
    console.log(courseId)
    const findCourseIndex = COURSES.findIndex(course => course.id === courseId);
    if (findCourseIndex !== -1) {
      COURSES[findCourseIndex].title = title;
      COURSES[findCourseIndex].description = description;
      COURSES[findCourseIndex].price = price;
      COURSES[findCourseIndex].imageLink = imageLink;
      COURSES[findCourseIndex].published = false;
      res.status(200).send('Course updated successfully');
    } else {
      res.status(404).send('Course not found');
    }
  } else {
    res.status(400).send('Invalid credentials');
  }
});


app.get('/admin/courses', (req, res) => {
  const { username, password } = req.headers;
  const findAdmin = ADMINS.find(admin => admin.username === username);
  if (findAdmin && findAdmin.password === password) {
    res.status(200).json(COURSES);
  } else {
    res.status(400).send('Invalid credentials');
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
