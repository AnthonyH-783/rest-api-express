const router = require("express").Router();
const User = require("../Models/User")
const bcrypt = require("bcrypt");


// Registration
router.post("/register", async (req, res)=>{
    
    try{
        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and response
        const user = await newUser.save(); // Save the user to the database
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
});

// Login

router.post("/login", async (req,res) => {

    try{
        // Looking for user email in database
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("User not found"); // error if user not found
        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Wrong Password"); // error if password is wrong
        // If everything is ok
        res.status(200).json(user);
    }

    catch(err){
        res.status(500).json(err);
    }
})
 


module.exports = router;