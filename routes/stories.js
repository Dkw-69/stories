const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

// @desc. show the 'add' page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc. process the stories add form
// @route POST /stories
router.post('/', ensureAuth, async(req, res) => {
   
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }

})

// @desc. show all the stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res) => {

    try {
        // fetch all public stories and tack on the user, time
        const stories = await Story.find({ status: 'public' })
        .populate('user') 
        .sort({ createdAt: 'desc' })
        .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }

})

// @desc. show a single sory
// @route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        
        if(!story){
            return res.render('errors/404')
        }

        res.render('stories/details', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('errors/400')
    }

})

// @desc. show the 'edit' page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()
    if(!story){
        return res.render('errors/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    }
    else{
        res.render('stories/edit', {
            story
        })
    }
})

// @desc. update the story
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    
    try {
        let story = await Story.findById(req.params.id).lean()
        if(!story){
            return res.render('errors/404')
        }
        if(story.user != req.user.id){
            res.redirect('/stories')
        }
        else{
            story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body,{
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(err)
        return res.render('errors/500')
    }

})

// @desc. show the 'delete' page
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('errors/500')
    }

})

// @desc. show user's stories
// @route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }

})


module.exports = router