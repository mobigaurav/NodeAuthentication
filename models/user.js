var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.createConnection;

var userSchema = mongoose.Schema({

    username:{

        type:String,
        index:true
    },
    email:{
        type:String
    },
    password:{

        type:String
    },
    phonenumber:{

        type:String
    },
    profileimage:{

        type:String
    }
})

var User = module.exports = mongoose.model('User',userSchema);
module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}
module.exports.getUserbyusername = function(username,callback){
    console.log('username is:'+username);
    var query = {email:username};
    User.findOne(query,callback);
}
module.exports.comparepassword = function(candidatepassword,hash,callback){
console.log("password is:"+candidatepassword);
console.log('hash password is:'+hash);
   bcrypt.compare(candidatepassword, hash, function(err, isMatch) {
       console.log(isMatch);
      callback(null,isMatch);
});
}
module.exports.createUser = function(newUser,callback){
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB.
         newUser.password = hash;
         newUser.save(callback);
    });
});

}
