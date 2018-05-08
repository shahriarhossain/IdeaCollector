const express = require('express');
const router = express.Router();

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
    res.send({
        type: "POST",
        title:       req.body.idea.title,
        description: req.body.idea.description
    });
})

module.exports =  router;