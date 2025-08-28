import mongoose from 'mongoose'

let initialized = false;
export const connect = async ()=>{
    mongoose.set('strictQuery',true);
    if(initialized){
        console.log('mongodb connected')
        return;
    }
    try{
          await  mongoose.connect(process.env.MONGODB_URI,{
            dbname:"next auth app",
            useNewUrlParser:true,
            useUnifiedTopology:true
          });
          console.log('mongodb connected');
          initialized= true;
    }
    catch(error){
        console.log('error',error);
    }
}
