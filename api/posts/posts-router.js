// implement your posts router here
const router = require('express').Router()
const Posts = require('./posts-model')

router.get('/',(req,res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
      .then(posts => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "The post information could not be retrieved",
        });
      });
  });

  router.post('/', async (req, res) => {
    try{
        const postsFromClient = req.body;
        if(!postsFromClient.title||!postsFromClient.contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }else{
            const newPosts = await Posts.insert(postsFromClient)
            res.status(201).json(newPosts)
        }
    }catch(err){
        res.status(500).json({
            message: "There was an error while saving the post to the database",
          });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {title, contents} = req.body;
        if(!title||!contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }else{
            const updatedPosts = await Posts.update(id,{title, contents})
            if(!updatedPosts){
                res.status(404).status({
                    message: "The post with the specified ID does not exist"
                })
            }else{
                res.status(200).json(updatedPosts)
            }
        }
      } catch (err) {
        res.status(500).json({
          error: "The post information could not be modified",
          message: err.message,
          stack: err.stack,
        })
      }
  })

  router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(deletedPosts =>{ 
        if(!deletedPosts){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }else{
            res.json(deletedPosts)
        }
    })
    .catch(err => {
      res.status(500).json({ 
              error: "The post could not be removed", 
              message: err.message,
              stack: err.stack
          })
    })
  })

  router.get('/:id/comments',(req,res) => {
    Posts.findCommentById(req.params.id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    })
  })

module.exports = router;


