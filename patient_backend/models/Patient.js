const mongoose = require('mongoose');
const mongoSchema = mongoose.Schema;
const { buildSchema } = require('graphql');

const HealthData = {
    creation_time: "",
    body_temperature_C: .0,
    heart_rate: 0,
    blood_pressure: {
      systolic: 0,
      diastolic: 0
    },
    daily_motivation: ""
  };


const patientMongoSchema = new mongoose.Schema({
    userid: Number,
    username: String,
    password: String,
    health_data: Array
});
const Patient = mongoose.model('patient', patientMongoSchema);

const patientSchema = buildSchema(`
    type Patient {
        userid: Int!
        username: String!
        password: String!
        health_data: [HealthData!]!
    }
    type HealthData {
        creation_time: String!
        body_temperature_C: Float!
        heart_rate: Int!
        blood_pressure: BloodPressure!
        daily_motivation: String!
    }
    type BloodPressure {
        systolic: Int!
        diastolic: Int!
    }
    type Query {
        Patients: [Patient]
        PatientById(userid: Int!): Patient
    }
    type Mutation {
        addPatient(userid: Int!, username: String, password: String, health_data: [HealthDataInput]): Patient
        updatePatient(userid: Int!, username: String, password: String, health_data: [HealthDataInput]): Patient
        deletePatient(userid: Int!): Patient!
        authenticatePatient(userid: Int!, password: String!): Patient
    }
    input HealthDataInput {
        creation_time: String!
        body_temperature_C: Float!
        heart_rate: Int!
        blood_pressure: BloodPressureInput!
        daily_motivation: String!
    }
    input BloodPressureInput {
        systolic: Int!
        diastolic: Int!
    }
`);

const patientResolvers = {
    Patients: async () => {
        const patients = await Patient.find();
        return patients;
    },
    PatientById: async ({userid}) => {
        const patient = await Patient.findOne({userid});
        return patient;
    }, 
    addPatient: async ({userid, username, password, health_data}) => {
        const patient = new Patient({userid, username, password, health_data});
        await patient.save();
        return patient;
    },
    updatePatient: async ({userid, username, password, health_data}) => {
        const patient = await Patient.findOneAndUpdate({userid}, {username, password, health_data}, {new: true});
        return patient;
    },
    deletePatient: async ({userid}) => {
        const patient = await Patient.findByIdAndDelete({userid});
        return patient;
    },
    authenticatePatient: async ({userid, password}) => {
        const patient = await Patient.findOne({userid, password});
        return patient;
    }
};

module.exports = {
    patientSchema,
    patientResolvers
};





