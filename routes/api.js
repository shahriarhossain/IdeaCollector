const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://goforshahriar:<password>@ds014648.mlab.com:14648/ideacollectordb')
        .then(()=>{
            console.log("Connected with mongodb");
        })
        .catch(err => console.log(err));

//Load Model
require('../models/Idea');
const Idea = mongoose.model('Ideas');

//Index page
router.get('/', (req, res)=>{
    res.render("Index");
})

//About page
router.get('/About', (req, res)=>{
    res.render("About");
})

//get idea
router.get('/AddIdea', (req, res)=>{
    res.render("CreateIdea");
})

//View idea by ID
//Use route parameter for essential values. /ViewIdea/:id 
//We could pass multiple parameters too. /ViewIdea/:year/:month
//Use query string params to indicate additional data/optional values. /ViewIdea/:id?sortBy=popularity   
router.get('/ViewIdea/:id', (req, res)=>{
    console.log(req.params.id);   
    console.log(req.query);  
})

//set idea
router.post('/AddIdea', (req, res)=>{ 
    ////validation from scratch
    // if(req.body.idea.title.length<3) 
    // {
    //     res.status(400).send("Title length must be 4 atleast");
    //     return;
    // }

    ////validation with Joi middleware
    // const validationSchema = {
    //     body:{
    //         idea:{
    //             title: Joi.string().min(4).required(),
    //             description: Joi.string().min(4)
    //         }     
    //     }
    // };

    // const validationResult = Joi.validate(req, validationSchema);
  
    // if(validationResult.error)
    // {
    //     res.status(400).send(validationResult.error.details[0].message);
    //     return;
    // }

    const {error} = customValidation(req);
  
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    //populating the model with data
    const newIdea = {
        title: req.body.idea.title,
        description: req.body.idea.description
    }

    new Idea(newIdea)
        .save()
        .then(idea=>{
            res.redirect('/about');
        })
})

function customValidation(req){
    const validationSchema = {
        idea:{
            title: Joi.string().min(4).required(),
            description: Joi.string().min(4)
        }     
    };

    return Joi.validate(req.body, validationSchema);
}
module.exports =  router;