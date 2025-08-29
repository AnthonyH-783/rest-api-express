const router = require("express").Router();
const Post = require("../Models/Post");
const User = require("../Models/Post");

router.get("/", async (req, res)=>{
    res.send("It's post route")
});

// Create a Post
router.post("/", async (req,res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// Update a Post
router.put("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body });
            res.status(200).json("The post has been updated");
        }
        else{
            res.status(403).json("You can update only your own posts");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})
// Delete a Post
router.delete("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            // Delete the post
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        }
        else{
            res.status(403).json("You can delete only your own posts");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});
// Like/Dislike a Post
router.put("/:id/like", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId }});
            res.status(200).json("The post has been liked");
        }
        else{
            await post.updateOne({$pull: {likes: req.body.userId }})
        }

    }
    catch(err){
        res.status(500).json(err);
    }
});
// Get a Post
router.get("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json("The post has been retrieved");
    }
    catch(err){
        res.status(500).json(err);
    }
})
// Get Timeline Posts

module.exports = router;