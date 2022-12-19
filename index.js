var express = require('express');
var con = require('./connection');
var bodyParser = require('body-parser')


var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"))


con.connect(function (error) {
    if (error) console.log(error)
    console.log("database connected")
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/students.html");
})

app.get("/display", function (req, res) {
    var sql = "select * from students"
    con.query(sql, function (error, result) {
        if (error) throw error;
        res.render("display", { list: result })
    })
})

app.post("/", function (req, res) {
    var name = req.body.name;
    var age = req.body.age;
    var usn = req.body.usn;
    var rollnum = req.body.rollnum;
    var department = req.body.department;

    var sql = "INSERT INTO students(name,age,usn,rollnum,department) VALUES ?"

    values = [
        [name, age, usn, rollnum, department]
    ]
    con.query(sql, [values], function (error, result) {
        if (error) console.log(error)
        // res.send("Student added successfully");
        res.redirect("/display")
    })
})

app.get("/edit", function (req, res) {
    var id = req.query.id;
    // console.log(id);
    var sql = "select * from students where id=?"
    con.query(sql, [id], function (error, result) {
        if (error) throw error;
        // console.log(result)
        res.render("edit", { editList: result })
    })
})

app.post("/edit", function (req, res) {
    var name = req.body.name;
    var age = req.body.age;
    var usn = req.body.usn;
    var rollnum = req.body.rollnum;
    var department = req.body.department;
    var id = req.body.id;

    var sql = "UPDATE students set name=?, age=?, usn=?, rollnum=?, department=? where id=?";

    con.query(sql,[name, age, usn, rollnum, department, id] , function (error, result) {
        if (error) throw error;
        // console.log(result)
        // res.render("edit",{editList:result})
        res.redirect("/display")
    })
})

app.get("/delete",function(req,res){
    var id=req.query.id;
    var sql = "delete from students where id=?"
    con.query(sql,[id],function(error,result){
        if(error) throw error;
        res.redirect("/display")
    })
})

app.listen(7000);
