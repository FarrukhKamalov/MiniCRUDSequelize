const express = require("express");

const app = express();
const {Sequelize, DataTypes,Op} = require("sequelize");

const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/learning')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const Users = sequelize.define('users',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})


sequelize.sync({force: true}).then(()=>{console.log("ok")})


app.get("/", async(req,res)=>{
    const users = await Users.findAll({
        where: {
            age: {
                [ Op.gte ]:19 
            }
        }
    })
    res.json({users})
})

app.post("/",async(req,res)=>{
    const {name, age} = req.body;
    const  newUser = await Users.findOrCreate({where: {name, age}});
    res.json(newUser);
})

app.put("/", async(req,res)=>{
    const {id, name, age} = req.body
    const updateUser = Users.update({name, age}, {
        where: id
    })
    res.json(updateUser)
})

app.delete("/:id", async(req,res)=>{
    const id = req.params;
    const deleteUser = Users.destroy({
        where: id
    })
    res.json({delete: true})
})

app.listen(3000, ()=> {
    console.log('http://localhost:3000/')
})