const mongoose = require('mongoose');
const Comments = require('./comment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const postsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ], 
},
{ 
    timestamps: true
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