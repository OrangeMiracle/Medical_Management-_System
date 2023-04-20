const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const {nurseSchema, nurseResolvers} = require('./models/Nurse');
const { mergeSchemas } = require('@graphql-tools/schema')
const { mergeResolvers } = require("@graphql-tools/merge")
const cors = require('cors');


const app = express();
mongoose.connect("mongodb+srv://orange:WRHkao150@cluster0.pfthjwp.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open',()=>console.log('Database connected.......'));



app.use(bodyParser.json());

//Add headers when receiving requests
app.use(cors());
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Header','Content-Type, Authorization');
  if(req.method==='OPTIONS'){
    return res.sendStatus(200);
  }
  next();
})

app.use(
    '/graphql',
    graphqlHTTP({
      schema: nurseSchema,
      rootValue: nurseResolvers,
      graphiql: true,
    })
  );


  app.get('/',(req,res,next) =>{
    res.send('Hello world');
});
app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });