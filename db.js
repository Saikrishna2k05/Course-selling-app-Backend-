const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const ObjectId=mongoose.Types.ObjectId;
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    email: {type: String, unique:true},
    username: String,
    password: String,
    firstname: String,
    lastname: String
})

const AdminSchema=new Schema({
    email: {type: String, unique:true},
    username: String,
    password: String,
    firstname: String,
    lastname: String
})

const CourseSchema=new Schema({
    title:String,
    description: String,
    price: Number,
    image: String,
    creatorId: ObjectId
})

const PurchaseSchema=new Schema({
    courseId: ObjectId,
    userId: ObjectId
})

const UserModel=mongoose.model('user', UserSchema);
const AdminModel=mongoose.model('admin', AdminSchema);
const CourseModel=mongoose.model('courses', CourseSchema);
const PurchaseModel=mongoose.model('purchases', PurchaseSchema);

module.exports={
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}
