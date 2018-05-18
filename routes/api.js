const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

router.use('/static', express.static('public'))

const mongoConStr=`mongodb://goforshahriar:${process.env.mLabPw}@ds014648.mlab.com:14648/ideacollectordb`;
//connect to MongoDB
mongoose.connect(mongoConStr)
        .then(()=>{
            console.log("Connected with mongodb");
        })
        .catch(err => console.log(err));

//Load Model
const Idea = require('../models/Idea');

router.get('/', (req, res)=>{
    res.render("Index");
})

router.get('/About', (req, res)=>{
    res.render("About");
})

router.route('/Ideas/Add')
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
                validationError: validationError,
                idea : {
                    title: req.body.idea.title,
                    description : req.body.idea.description
                }
            });
            return;
        }
      
          //populating the model with data
          const newIdea = new Idea({
              title: req.body.idea.title,
              description: req.body.idea.description
          })

          newIdea.save()
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

router.delete('/Ideas/Delete/:id', (req, res)=>{
    Idea.findOne({_id: req.params.id})
        .then(idea=>{
            idea.remove({ _id: req.params.id})
                .then(()=>{
                    res.redirect('/Ideas');
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
//View idea by ID
//Use route parameter for essential values. /ViewIdea/:id 
//We could pass multiple parameters too. /ViewIdea/:year/:month
//Use query string params to indicate additional data/optional values. /ViewIdea/:id?sortBy=popularity   
router.get('/Ideas/:id', (req, res)=>{
    console.log(req.params.id);   
    console.log(req.query);  
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