const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");

router.get("/", async (req, res)=>{
    res.send("It's user route")
});

// Update User
router.put("/:id", async(req,res) => {
    // Check if the user is updating their own account or if they are an admin
    if(req.body.userId === req.params || req.body.isAdmin){
        //If password is being updated, hash the new password
        if(req.body.password){
            try{
            const salt = await bcrypt.gensalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body, });
            res.status(200).json("Account has been updated");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
            return res.status(403).json("You can update only your account");
        }

})
// Delete User
router.delete("/:id", async(req,res) => {
    // Check if the user is deleting their own account or if they are an admin
    if(req.body.userId === req.params || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
            return res.status(403).json("You can delete only your account");
        }
});

// Get a User
// Follow a User
// Unfollow a User
   


module.exports = router;