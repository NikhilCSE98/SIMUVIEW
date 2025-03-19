const mongoose=require('mongoose')
require('dotenv').config();
const DATABASE=mongoose.connect(process.env.DATABASE||'mongodb+srv://nv65260:sGJpXTRIvpoN7tCK@cluster0.b0uke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
DATABASE.then(()=>{
    console.log('database connected')
})
.catch(()=>{
    console.log('database cannot be connected')
})