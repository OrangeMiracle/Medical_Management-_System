const mongoose = require('mongoose');
const mongoSchema = mongoose.Schema;
const { buildSchema } = require('graphql');


const nurseMongoSchema = new mongoose.Schema({
    userid: Number,
    username: String,
    password: String
});
const Nurse = mongoose.model('nurse', nurseMongoSchema);


const nurseSchema = buildSchema(`
    type Nurse {
        userid: Int!
        username: String!
        password: String!
    }
    type Query {
        nurses: [Nurse]
        nurseById(userid: Int!): Nurse
    }
    type Mutation {
        addNurse(userid: Int!, username: String!, password: String!): Nurse!
        updateNurse(userid: Int!, username: String!, password: String!): Nurse!
        deleteNurse(userid: Int!): Nurse!
        authenticateNurse(userid: Int!, password: String!): Nurse
    }
`);

const nurseResolvers = {
    nurses: async () => {
        try{
            const nurses = await Nurse.find();
            const nursesArray = [];
            nurses.forEach(function(nurse) {
                nursesArray.push(nurse);
            });
            return nursesArray;
        }catch(err){
            console.log(err);
        }
    },
    nurseById: async ({userid}) => {
        const nurse = await Nurse.findOne({userid});
        return nurse;
    },
    addNurse: async ({userid, username, password}) => {
        const nurse = new Nurse({userid, username, password});
        await nurse.save();
        return nurse;
    },
    updateNurse: async ({userid, username, password}) => {
        const nurse = await Nurse.findOneAndUpdate({userid}, {username, password}, {new: true});
        return nurse;
    },
    deleteNurse: async ({userid}) => {
        const nurse = await Nurse.findOneAndDelete({userid});
        return nurse;
    },
    authenticateNurse: async ({userid, password}) => {
        const nurse = await Nurse.findOne({userid, password});
        return nurse;
    }
};

module.exports = {
    nurseSchema,
    nurseResolvers
};
