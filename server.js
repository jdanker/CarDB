const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cars', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect to mongodb...", err)));

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


const fordFiesta = new Vehicle({
    make:"Ford",
    model:"Fiesta",
    hp:150,
    price:15640,
    trims:["mix dry ingredients", "mix wet ingredients", "mix everything", "put on cookie sheet", "bake"],
    truck:false
});
createCar(fordFiesta);

function validateCar(car){
    const schema = {
        make:Joi.string().min(3).required(),
        model:Joi.string().min(3).required(),
        hp:Joi.number(),
        price:Joi.number(),
        trim:Joi.allow(),
        truck:Joi.allow()    
    }
    return Joi.validate(car,schema)
}

app.post('/api/cars', (req,res)=>{
    const result = validateCar(req.body)

    if(result.error){
        res.status(400).send(result.err.details[0].message)
        return;
    }

    const car = new Vehicle({
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

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getCars(res){
    const cars = await Vehicle.find()
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
    const car = await Vehicle
    .findOne({_id:id})
    console.log(car)
    res.send(car)
}

app.put('/api/cars/:id',(req,res)=>{
    const result  = validateCar(req.body)

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateCar()
})

async function updateCar(res, id, make, model, hp, price, truck){
    const result = await Vehicle.updateOne({_id:id},{
        $set:{
            make:make,
            model:model,
            hp:Number(hp),
            price:Number(price),
            trim:trim,
            truck:truck
        }
        
        })
        res.send(result)
}

app.delete('/api/cars/:id',(req,res)=>{
    removeCar(res, req.params.id)
})

async function removeCar(res,id) {
    const car = await Vehicle.findByIdAndRemove(id)
    res.send(car)
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
