const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");

router.get("/", async (req, res)=>{
    res.send("It's user route")
});

// Update User
router.put("/:id", async(req,res) => {
    // Check if the user is updating their own account or if they are an admin
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //If password is being updated, hash the new password
        if(req.body.password){ // body containing password -> new password
            try{
                // Encrypting new password
            const salt = await bcrypt.gensalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            // Findding user  by id and updating
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body, });
            res.status(200).json("Account has been updated");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        
            const message = "You can update only your account";
            return res.status(403).json(message);
        }

})
// Delete User
router.delete("/:id", async(req,res) => {
    // Check if the user is deleting their own account or if they are an admin
    if(req.body.userId === req.params.id || req.body.isAdmin){
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
router.get("/:id", async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc; // Exclude password and updatedAt from the rest
        return res.status(200).json(other);

    }
    catch(err){
        return res.status(500).json(err);
    }
})
// Follow a User
router.put("/:id/follow", async (req,res) => {
    try{
        if(req.body.userId !== req.params.id){
            const user = await User.findById(req.params.id); // user to be followed
            const currentUser = await User.findById(req.body.userId); // user who is following
            if(!user.followers.includes(req.body.userId)){
                // If not already following, follow the user
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {followees: req.params.id}});
                return res.status(200).json("User has been followed")
            }
            else{
                // If already following
                return res.status(403).json("You already follow this user");
            }
        }

    }
    catch(err){
        return res.status(500).json(err);

    }

});
// Unfollow a User
router.put("/:id/unfollow", async (req,res) => {
    try{
        if(req.body.userId !== req.params.id){
            // Making sure user is not trying to unfollow themselves
            const user = await User.findById(req.params.id); // user to be unfollowed
            const currentUser = await User.findById(req.body.userId); // user who is unfollowing
            if(user.followers.includes(req.body.userId)){
                // If currently following, unfollow the user
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: {followees: req.params.id}});
                return res.status(200).json("User has been unfollowed");
            }
            else{
                return res.status(403).json("You do not follow this user");
            }

        }
        else{
            return res.status(403).json("You cannot unfollow yourself");
        }

    }
    catch(err){
        return res.status(500).json(err);
    }
})
   


module.exports = router;