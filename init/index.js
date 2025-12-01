const mongoose = require("mongoose");
const initData = require("./data.js");
const jobPostSchema = require("../models/jobPost.js");
let MONGO_URL = "mongodb://127.0.0.1:27017/Consultancy";
main()
.then(()=>{
    console.log("connection db");
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async () =>{
    await jobPostSchema.deleteMany({});
    // console.log(initData,"....................")
    //initData.data = initData.data.map((obj)=>({...obj, owner:'66c7f2b84115fb8736c3304a'}))
   // await jobPostSchema.insertMany(initData.data);
    console.log("data was initilize");
}

initDB();