const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cars', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect ot mongodb...", err)));

const carSchema = new mongoose.Schema({
    make:String,
    model:String,
    hp:Number,
    price:Number,
    trim:[String],
    truck: Boolean
});

const Vehicle = mongoose.model('Vehicle', carSchema)

async function createCar(car){
    const result = await car.save()
    console.log(result)
}

function validateCar(car){
    const schema = {
        make:Joi.string().min(3).required(),
        model:Joi.string().min(3).required(),
        hp:Joi.number(),
        price:Joi.number(),
        trim:Joi.array(),
        truck:Joi.boolean()    
    }
    return Joi.validate(car,schema)
}

app.post('/api/cars', (req,res)=>{
    const result = validateCar(req.body)

    if(result.error){
        res.status(400).send(result.err.details[0].message)
        return;
    }

    const car = new Car({
        make:req.body.make,
        model:req.body.model,
        hp:Number(req.body.hp),
        price:Number(req.body.price),
        trim:req.body.trim,
        truck:req.body.truck
    })

    createCar(car)
    res.send(car)
})

async function getCars(res){
    const cars = await Car.find()
    console.log(cars)
    res.send(cars)
}

app.get('/api/cars',(req,res)=>{
    const cars = getCars(res)
})

app.get('/api/cars/:id',(req,res)=>{
    let car = getCar(req.params.id,res)
})

async function getCar(id,res){
    const car = await Car
    .findOne({_id:id})
    console.log(car)
    res.send(car)
}

// TODO put
