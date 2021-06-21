const mongoose = require('mongoose');
const Comments = require('./comment');
const Schema = mongoose.Schema;

const postsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    imgUrl: String,
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
});

postsSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Comments.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts; 