const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const {patientSchema, patientResolvers} = require('./models/Patient');
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




app.get('/',(req,res,next) =>{
    res.send('Hello world');
});

app.use(
    '/graphql',
    graphqlHTTP({
        schema: patientSchema,
        rootValue: patientResolvers,
        graphiql: true,
    })
);




app.listen(4001, () => {
    console.log('Server is running on port 4001');
  });