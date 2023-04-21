import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'

const AddEditDailyHealthDataPage = () => {
    const {patientid,infoIndex} = useParams();
    const [patientName, setPatientName] = useState('');
    const [creation_time, setCreation_time] = useState('');
    const [body_temperature_C, setBody_temperature_C] = useState('');
    const [heart_rate, setHeart_rate] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [daily_motivation, setDaily_motivation] = useState('');

    useEffect(() => {
        const getPatientDataRequestBody = {
            query: `
                query {
                    PatientById(userid:${patientid}) {
                        userid
                        username
                        health_data {
                        creation_time
                        body_temperature_C
                        heart_rate
                        blood_pressure {
                            systolic
                            diastolic
                        }
                        daily_motivation
                        }
                    }
                }
            `
        }
        console.log(getPatientDataRequestBody);
        fetch('http://localhost:4001/graphql', {
            method: 'POST',
            body: JSON.stringify(getPatientDataRequestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            if (resData.data && resData.data.PatientById) {
                console.log('Patient data retrieved');
                console.log(resData.data.PatientById.health_data[infoIndex]);
                setPatientName(resData.data.PatientById.username);
                setCreation_time(resData.data.PatientById.health_data[infoIndex].creation_time);
                setBody_temperature_C(resData.data.PatientById.health_data[infoIndex].body_temperature_C);
                setHeart_rate(resData.data.PatientById.health_data[infoIndex].heart_rate);
                setSystolic(resData.data.PatientById.health_data[infoIndex].blood_pressure.systolic);
                setDiastolic(resData.data.PatientById.health_data[infoIndex].blood_pressure.diastolic);
                setDaily_motivation(resData.data.PatientById.health_data[infoIndex].daily_motivation);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [patientid]);



    const handleformSubmitEvent = () => {
        console.log('form submitted');
        console.log(document.getElementById('creation_time'));
    }


    return (
        <div className='addEditPageDiv'>
            <div className='container'>
                <h1>Add/Edit Daily Health Data</h1>
                <h3>Patient Name: {patientName}</h3>
                <h3>Patient ID: {patientid}</h3>
                <h3>Info Index: {infoIndex}</h3>
                <div>
                    <form id="addHealthDataForm" onSubmit={handleformSubmitEvent()}>
                        <label for="creation_time">Creation Time:</label>
                        <input type="datetime-local" id="creation_time" name="creation_time" required value={new Date().toISOString().slice(0, -8)}/><br /><br />
                        {console.log(new Date().toISOString().slice(0, -8))}
                        <label for="body_temperature_C">Body Temperature (C):</label>
                        <input type="number" step="0.1" id="body_temperature_C" name="body_temperature_C" required /><br /><br />

                        <label for="heart_rate">Heart Rate:</label>
                        <input type="number" id="heart_rate" name="heart_rate" required /><br /><br />

                        <label for="systolic">Systolic Blood Pressure:</label>
                        <input type="number" id="systolic" name="systolic" required /><br /><br />

                        <label for="diastolic">Diastolic Blood Pressure:</label>
                        <input type="number" id="diastolic" name="diastolic" required /><br /><br />

                        <label for="daily_motivation">Daily Motivation:</label>
                        <textarea id="daily_motivation" name="daily_motivation" required></textarea><br /><br />

                        <button type="submit">Add Health Data</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddEditDailyHealthDataPage;