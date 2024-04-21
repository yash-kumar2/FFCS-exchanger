const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const Req = require('../models/requests')

const router = new express.Router()
router.get('/users/dashboard',auth, async (req, res) => {
    try{console.log(req.user)
        const userData = {
            regno: req.body.regno,
            contact: '1234567890',
            email: 'example@example.com'
        };

        const tasks = await Task.find({owner:req.user.id})
        //const tasks = await Task.find({})
        res.render('profile.ejs',{ userData: req.user,tasks:tasks })
        console.log(tasks)
      
    }
        
    
    catch{
    
        res.redirect('/users/login');
    }
  });
  router.get('/users/requests',auth, async (req, res) => {
    try{console.log(1111)
        
        const reqs=await Req.find({to:req.user.id})
         var requests=[]
        for(var i=0;i<reqs.length;i++){
            const task1=await Task.findById(reqs[i].for)
            console.log(reqs[i])
            console.log("sdf")
            const user=await User.findById(reqs[i].to)
            var obj={
                from:user.regno,
                contact:user.contact,
                slot:task1.slot,
                venue:task1.venue,
                message:reqs[i].message,
                
            }
            
           


        }
        
        console.log(obj)
        console.log("yash")
        res.render('requests.ejs',{tasks:requests})
        
        //const tasks = await Task.find({})
       
      
    }
        
    
    catch{
    
        res.redirect('/users/login');
    }
  });
  router.get('/',(req,res)=>{
    console.log(req.cookies)

    
    res.render('home.ejs')
  })
  router.get('/users',(req,res)=>{
    

    
    res.render('register.ejs')
  })
  
  

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        console.log(req.body)
        await user.save()
        const token = await user.generateAuthToken()
       
        const options={
            maxAge:120000000,
            httpOnly:true
        }
        res.cookie('auth_token', token, {
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
            httpOnly: true, 
            secure: true // This ensures the cookie is only sent over HTTPS
    
        });
        console.log("user")
       
        res.redirect('/users/dashboard');
        
    } catch (e) {
        res.redirect('/users/');
    }
})
router.get('/users/login', (req, res) => {
    res.render('login.ejs')
  });

router.post('/users/login', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log("sdfsf")
        const options={
            expires: new Date(Date.now  +3600000)
        }
        res.cookie('auth_token', token, {
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
            httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
            secure: true // This ensures the cookie is only sent over HTTPS
            // You might need to adjust the 'secure' option based on your deployment environment
        });
       
        res.redirect('/users/dashboard');
    } catch (e) {
        
        res.redirect('/users/login');
    }
})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.render('home.ejs')
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {
    console.log(req.user)
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'regno']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router