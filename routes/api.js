const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

router.use('/static', express.static('public'))

//connect to MongoDB
mongoose.connect('mongodb://goforshahriar:admin123@ds014648.mlab.com:14648/ideacollectordb')
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

//View idea by ID
//Use route parameter for essential values. /ViewIdea/:id 
//We could pass multiple parameters too. /ViewIdea/:year/:month
//Use query string params to indicate additional data/optional values. /ViewIdea/:id?sortBy=popularity   
router.get('/ViewIdea/:id', (req, res)=>{
    console.log(req.params.id);   
    console.log(req.query);  
})

//get idea
router.route('/AddIdea')
      .get((req, res)=>{
        res.render("CreateIdea");
      })
      .post((req, res)=>{ 
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
        let validationError=[];
        if(error)
        {
            validationError.push(error.details[0].message);
        }
        
        if(validationError.length>0){
            res.render('CreateIdea', {
                validationError: validationError
            });
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
                  res.redirect('/ideas');
              })
      })

router.route('/Ideas/Edit/:id')
      .get((req, res)=>{
          Idea.findOne({
            _id: req.params.id
            })
            .then(ideas =>{
                console.log("Here I am ");
                res.render("EditIdea", {
                    idea : ideas
                });
            })
     })
      .put((req, res)=>{
        Idea.findOne({
            _id: req.params.id
            })
            .then(idea=>{
               
                idea.title = req.body.idea.title,
                idea.description = req.body.idea.description

                idea.save()
                    .then(idea=>{
                        res.redirect('/ideas');
                    })
            })
      })

router.get('/Ideas', (req, res)=>{
    //fetch data from db
    Idea.find({})
        .sort({createdOn : 'desc'})
        .then(ideas =>{
            res.render("Ideas", {
                ideas : ideas
            });
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