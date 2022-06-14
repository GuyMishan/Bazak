const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {type: String,trim: true,required: true,maxlength: 32},
    lastname: {type: String,trim: true,required: true},
    migzar:{type:String},
    gender:{type:String},
    cellphone:{type:String},
    rank:{type:String},
    personalnumber: {type: String,trim: true,unique:true,require:true},
    validated:{type: Boolean,default:false},
    role:{type: String,default:"0"},
    unitid: {type:ObjectId,ref:'Unit'},
    hashed_password: {type: String,required: true},
    salt: String,
    //17.2
    population:{type:ObjectId,ref:'Population'},
    job:{type:ObjectId,ref:'Job'},
    //11.4
    user_grade_handasi:{type:Number},
    user_grade_nihuli:{type:Number},
    user_grade_pikudi:{type:Number},
    //
    birthdate:{type:Date},
    residence:{type:String},
    marital_status:{type:String},
    education:{type:String},
    curr_tatash:{type:Date},
    promotion_date:{type:Date},
    keva_entry:{type:Date},
    service_model:{type:String},
    jobs_in_rank:{type:String},
    sigli_data:{type:Array},
    taal_excellence:{type:String,default:"לא"},
    ayen_tik:{type:String,default:"לא"},
    mezah:{type:String,default:"לא"},
    tlunot:{type:String,default:"לא"},
    tamriz:{type:String,default:"לא"},
    tziun_mh:{type:Number},
    sivug:{type:String,default:"שמור"},
    comment:{type:String},
}, {timestamps: true})

// virtual field
userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        } catch (err) {
            return "";
        }
    }
};
module.exports = mongoose.model("User", userSchema);