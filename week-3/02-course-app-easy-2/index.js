const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateToken = (user) => {
  const payload = {
    username: user.username,
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

  return token;
}

const verifyToken = (req, res, next) => {
  const Header = req.headers["authorization"];
  const token = Header && Header.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

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
    const token = generateToken(findAdmin.username);
    res.status(200).send('Logged in successfully');
  } else {
    res.status(400).send('Invalid Credentials');
  }
});

let id = 1;

app.post('/admin/courses', verifyToken, (req, res) => {
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

app.put('/admin/courses/:courseId', verifyToken, (req, res) => {
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


app.get('/admin/courses', verifyToken, (req, res) => {
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
  const { username, password } = req.body;
  const findUser = USERS.find(user => user.username === username);
  if (findUser) {
    res.status(400).send('Already Exists!');
  } else {
    USERS.push({ username: username, password: password, courses: [] });
    res.status(200).send('User created successfully');
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const findUser = USERS.find(user => user.username === username);
  if (findUser && findUser.password === password) {
    const token = generateToken(findUser.username);
    res.status(200).send('Logged in successfully');
  } else {
    res.status(400).send('Invalid Credentials');
  }
});

app.get('/users/courses', verifyToken, (req, res) => {
  const { username, password } = req.headers;
  const findUser = USERS.find(user => user.username === username);
  if (findUser && findUser.password === password) {
    res.status(200).json(COURSES);
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.post('/users/courses/:courseId', verifyToken, (req, res) => {
  // logic to purchase a course
  const { username, password } = req.headers;
  const findUser = USERS.findIndex(user => user.username === username);
  // console.log(findUser);
  if (findUser !== -1 && USERS[findUser].password === password) {
    const courseId = parseInt(req.params.courseId);
    // console.log('Id ', courseId);
    const findCourseIndex = COURSES.findIndex(course => course.id === courseId);
    if (findCourseIndex !== -1) {
      USERS[findUser].courses.push(courseId);
      res.status(200).send('Course purchased successfully');
    } else {
      res.status(404).send('Course not found');
    }
  } else {
    res.status(400).send('Invalid credentials');
  }

});

app.get('/users/purchasedCourses', verifyToken, (req, res) => {
  const { username, password } = req.headers;
  const findUser = USERS.findIndex(user => user.username === username);
  if (findUser !== -1 && USERS[findUser].password === password) {
    res.status(200).json(USERS[findUser].courses)
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
