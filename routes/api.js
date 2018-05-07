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

//set idea
router.post('/AddIdea', (req, res)=>{ 
    res.send({
        type: "POST",
        title:       req.body.idea.title,
        description: req.body.idea.description
    });
})

module.exports =  router;