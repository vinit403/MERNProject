require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require('bcryptjs');
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());

//Get the data for form 
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

// create a new user in our database
app.post("/register", async(req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            console.log("The success part " + registerEmployee)

            // Generate Token for check the user is orignal or fake

            const token = await registerEmployee.generateAuthToken();
            console.log("token part is " + token);

            // Password hash process (This process is called middleware)
            // Code in models/registers.js file

            const registerd = await registerEmployee.save();
            console.log("Main page is " + registerd);

            res.status(201).render("index")
        } else {
            res.send("Password are not Matching...")
        }

    } catch (error) {
        res.status(400).send(error)
        console.log("Error part")
    }
})

// Check login user

app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        // match password process between user input password nd hash password
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("token part is " + token);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid Password");
        }

    } catch (error) {
        res.status(400).send("Invalid Log In Details")
    }
})


app.listen(port, () => {
    console.log(`Server is live at ${port}`);
})