const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const {nurseSchema, nurseResolvers} = require('./models/Nurse');

const app = express();
mongoose.connect("mongodb+srv://orange:WRHkao150@cluster0.pfthjwp.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open',()=>console.log('Database connected.......'));


app.use(bodyParser.json());

app.get('/',(req,res,next) =>{
    res.send('Hello world');
});

app.use(
    '/graphql',
    graphqlHTTP({
      schema: nurseSchema,
      rootValue: nurseResolvers,
      graphiql: true,
    })
  );

app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });