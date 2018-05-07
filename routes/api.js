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
    res.render("AddIdea");
})

//set idea
router.post('/AddIdea', (req, res)=>{
    console.log(req.body);
    res.send({
        type: "POST",
        title: req.body.title,
        description: req.body.description
    });
})

module.exports =  router;