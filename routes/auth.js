const express = require('express');
const router = express.Router();
const Author = require('../schema/author.schema');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');


router.get('/',(req,res) => {
    res.send('login page');
});

router.post('/register', async (req, res, next) => {
    
const saltRounds = 10;
    try{
        const { name, email, password } = req.body;
        // console.log(req.body);
    const authorExists = await Author.findOne({email});
    if (authorExists){
        return res.status(400).send('Author already exists');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const author = new Author({
        name,
        email,
        password:hash
    });
    await author.save();
    const token = jwt.sign({_id: author._id}, process.env.TOKEN_SECRET);
    res.json({
        email: author.email,
        token

    })
    }
    catch(e){
        next(e);
        }
    

});

router.post('/login', async (req,res) => {
    try{
        const { email, password } = req.body;
    const authorExists = await Author.findOne({email});
    if (!authorExists){
        return res.status(400).send('email or password is wrong');
    }
    const validPass = bcrypt.compareSync(password, authorExists.password);
    if (!validPass){
        return res.status(400).send('email or password is wrong');
    }
    const token = jwt.sign({_id: authorExists._id}, process.env.TOKEN_SECRET);
    res.json({
        email: authorExists.email,
        token
        })
    }
    catch(e){
        throw new Error(e.message);
        }
    

});

router.post('/updatePassword', async (req,res) => {
    try{
        const { email, password, newPassword } = req.body;
        const token = req.headers['authorization'];
        const authorExists = await Author.findOne({email});
        if(!authorExists){
            return res.status(400).send('email or password is wrong');
        }
        const validPass = bcrypt.compareSync(password, authorExists.password);
        if (!validPass){
            return res.status(400).send('email or password is wrong');
            }
            const verifiedToken = jwt.verify(token , process.env.TOKEN_SECRET);
            const authorId = authorExists._id.toString();
            if(verifiedToken._id !== authorId){
                return res.status(401).send('Unauthorised');
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(newPassword, salt);
            await Author.findOneAndUpdate({email: authorExists.email}, {password : hash});
            res.json({message: 'Password updated successfully'});
            }
            catch(e){
                throw new Error(e.message);
                }
})


router.post('/verify', async (req, res, next) => {
    
    
    try{
        const token = req.headers['authorization'];
        const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const authorId = verifiedToken._id;
        const author = await Author.findById(authorId);
        res.json({
            email : author.email,
            name : author.name
        })
        }
        catch(e){
            next(e);
            }
        
    
    });







module.exports = router;