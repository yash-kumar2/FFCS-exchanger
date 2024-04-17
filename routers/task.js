const express = require('express')
const Task = require('../models/task')
const Req = require('../models/requests')
const auth = require('../middleware/auth')
const router = new express.Router()
router.get('/createtasks',auth,async (req,res)=>{
    res.render('createtask.ejs')
})

router.post('/createtasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
        contact:req.user.contact
    })

    try {
        await task.save()
        console.log(task)
        res.render('createtask.ejs')
    } catch (e) {
        res.status(400).send(e)
    }
})

//fitering not yet done

router.get('/tasks',auth, async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.render('taskslist.ejs', { tasks: tasks });
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/tasks',auth, async (req, res) => {
    try {
        console.log(req.body)
        const filteredBody = {};
        Object.entries(req.body).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                filteredBody[key] = value;
            }
        });
        console.log(filteredBody)
        const tasks = await Task.find(filteredBody)
        console.log(tasks)
        res.render('taskslist.ejs', { tasks: tasks });
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/requesttask/:id', auth, async (req, res) => {
    const tasks = await Task.findById(req.params.id)
    const task = new Req({
       for:req.params.id,
       to:tasks.owner,
       from:req.user.id,
       
    
        
    })
    console.log(task)
    //req.status(200)

    try {
        await task.save()
        console.log(task)
        res.redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
})
// router.post('/requesttask/:id', auth, async (req, res) => {
//     const tasks = await Task.findById(req.params.id)
//     const task = new Req({
//        for:req.params.id,
//        to:tasks.owner,
//        from:req.user.id,
       
    
        
//     })
//     console.log(task)
//     req.status(200)

//     try {
//         await task.save()
//         console.log(task)
//         res.redirect('/tasks')
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

module.exports = router