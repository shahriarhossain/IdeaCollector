const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const multer  = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');

//Load Models and Services
const Idea = require('../models/Idea');
const User = require('../models/User');
const UserServices = require('../services/UserServices');

router.use('/static', express.static('public'))

const imageFileName = uuidv1(); //generate random uuid
const mongoConStr=`mongodb://goforshahriar:${process.env.mLabPw}@ds014648.mlab.com:14648/ideacollectordb`;
//connect to MongoDB
mongoose.connect(mongoConStr)
        .then(()=>{
            console.log("Connected with mongodb");
        })
        .catch(err => console.log(err));

//Data Storage
const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.originalname.split('.')[0] + '-' + imageFileName + path.extname(file.originalname))
    }
})
  
const upload = multer({ 
    storage: storage,
    limits: {fileSize : 5* 1024 * 1024},
    fileFilter : (req, file, cb)=>{
        checkFileType(file, cb);
    }
}).single('ideaImage');

//Check File Type
function checkFileType(file, cb){
    const supportedType= /jpeg|jpg|png/;
    const extType = supportedType.test(path.extname(file.originalname).toLowerCase());
    const mimeType = supportedType.test(file.mimetype);

    if(extType && mimeType){
        return cb(null, true);
    }
    else
    {
        return cb('Error: Image Only');
    }
}

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
        upload(req, res, function (uploadErr) {
            let validationError=[];
            if (uploadErr) {
                validationError.push('An error occurred when uploading');
            }
            if(req.file == undefined){
                validationError.push('Error: No File Selected!')
            };
            
            const {error} = customValidation(req);
            
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
                description: req.body.idea.description,
                image: req.file.originalname.split('.')[0] + '-'+ imageFileName + path.extname(req.file.originalname)
            })
         
            newIdea.save()
                .then(idea=>{
                    res.redirect('/ideas');
                })
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

router.route('/User/SignUp')
    .get((req,res)=>{
        res.render('Registration')
    })
    .post((req,res)=>{
        let validationError=[];
        const {error} = regValidation(req);
            
            if(error)
            {
                validationError.push(error.details[0].message);
            }
            
            if(validationError.length>0){
                res.render('Registration', {
                    validationError: validationError,
                    name: req.body.name,
                    email : req.body.email,
                    password : req.body.password
                });
                return;
            }
            
            //populating the model with data
            const newUser = new User({
                name: req.body.name,
                email : req.body.email,
                password : req.body.password
            })

            UserServices.CreateUser(newUser, function(err, user){
                if(err){
                    throw err;
                }
                req.flash('success_message', 'Registration Successful');
                res.redirect('/User/Login');
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

router.route('/User/Login')
    .get((req, res)=>{
        res.render('Login');
    })
    .post((req, res)=>{
        User.find({email : req.body.email})
            .exec()
            .then(singleUser=>{
                if(singleUser.length>1){
                    res.status(409); //conflict
                }

                UserServices.ValidatePassword(singleUser[0].password, req.body.password, (err, isValidPw)=>{
                    if(isValidPw){
                        UserServices.GenerateJWT(singleUser[0], (err, token)=>{
                            console.log(`jwt token is : ${token}`)
                        })
                    }
                })
            })
            .catch()
    })

function regValidation(req){
    const validationSchema = {
        name: Joi.string().min(4).required(),
        email: Joi.string().min(4).required(),
        password: Joi.string().min(4).required()   
    };

    return Joi.validate(req.body, validationSchema);
}
module.exports =  router;