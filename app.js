var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.set('view engine', 'ejs');
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/comment_app', { useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    name: String,
    text: String,
    replys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
});

var Comment = mongoose.model('Comment', commentSchema);

var replySchema = mongoose.Schema({
    author: String,
    info: String
});

var Reply = mongoose.model('Reply', replySchema);

// ROUTES

app.get('/', function(req, res){
    res.render('landing');
});

// INDEX ROUTE - shows all comments
var list_all_comments = function(req, res){
    Comment.find().populate('replys').exec(function(err, comment){
        if(err) {
            res.send(err);
        } else {
            res.json(comment);
        }
    });
};
app.route('/comments').get(list_all_comments);
// app.get('/comments', function(req, res){
//     // get all comments from DB
//     Comment.find().populate('replys').exec(function(err, allComments){
//         if(err){
//             console.log(err);
//         } else{
//             res.json('index');
//             // res.render('comments/index', {comments2: allComments});
//         }
//     });
// });

// CREATE ROUTE - add new comment to DB
var create_a_comment = function(req, res){
    req.body.comm = {
        name: 'harry potter',
        text: 'expeliarmus'
    }
    var new_comm = req.body.comm;
    var new_comment = new Comment(new_comm);
    new_comment.save(function(err, comment){
        if(err) {
            res.send(err);
        } else {
            res.json(comment);
        }
    });
};

app.route('/comments').post(create_a_comment);
// app.post('/comments', function(req,res){
//     // get data from form and add to comments array
//     var name = req.body.name;
//     var text = req.body.text;
//     var newComment = {name: name, text: text}; 
//     // create a new comment and save to DB
//     Comment.create(newComment, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             // redirect back to comments page
//             res.redirect('/comments');
//         }
//     });
// });

// NEW - show form to create new comment
app.get('/comments/new', function(req, res){
    res.render('comments/new');
});

// ======================
// REPLY ROUTES
// ======================

app.get('/comments/:id/reply/new', function(req, res){
    // find comment by id
    Comment.findById(req.params.id, function(err, comment){
        if(err){
            console.log(err);
        } else {
            res.render('replys/new', {comment4: comment});
        }
    });
});

var create_a_reply = function(req, res){
    req.params = {
        author: 'jon snow',
        info: 'ayye'
    }
    var new_reply = new Reply(req.params);
    new_reply.save(function(err, reply){
        if(err) {
            res.send(err);
        } else {
            res.json(reply);
        }
    });
};

app.route('/comments/5f71919b617ae60f005ba05a/replys').post(create_a_reply);
// app.post('/comments/:id/replys', function(req, res){
//     // look up comment using id
//     Comment.findById(req.params.id, function(err, comment){
//         if(err){
//             console.log(err);
//             res.redirect('/comments');
//         } else {
//             // create new reply
//             Reply.create(req.body.reply, function(err, reply){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     // connect new reply to comment
//                     comment.replys.push(reply);
//                     comment.save();
//                     // redirect to comments page
//                     res.redirect('/comments');
//                 }
//             });
//         }
//     });
// });

// tell express to listen for requests (start server)

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('The Comment App Server has Started!!!');
});