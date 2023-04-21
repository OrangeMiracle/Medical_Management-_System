import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'

const AddEditDailyHealthDataPage = () => {
    const {patientid,infoIndex} = useParams();
    const [health_Data, setHealth_Data] = useState([]);

    const [patientName, setPatientName] = useState('');

    const [creation_time, setCreation_time] = useState('');
    const [body_temperature_C, setBody_temperature_C] = useState();
    const [heart_rate, setHeart_rate] = useState();
    const [systolic, setSystolic] = useState();
    const [diastolic, setDiastolic] = useState();
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
                console.log(resData);
                if (resData.data && resData.data.PatientById) {
                    if(infoIndex>=0){
                        console.log('Patient data retrieved');
                        console.log(resData.data.PatientById.health_data[infoIndex]);
                        
                        
                        setCreation_time(resData.data.PatientById.health_data[infoIndex].creation_time);
                        setBody_temperature_C(resData.data.PatientById.health_data[infoIndex].body_temperature_C);
                        setHeart_rate(resData.data.PatientById.health_data[infoIndex].heart_rate);
                        setSystolic(resData.data.PatientById.health_data[infoIndex].blood_pressure.systolic);
                        setDiastolic(resData.data.PatientById.health_data[infoIndex].blood_pressure.diastolic);
                        setDaily_motivation(resData.data.PatientById.health_data[infoIndex].daily_motivation);
                    }
                    setPatientName(resData.data.PatientById.username);
                    setHealth_Data(resData.data.PatientById.health_data);
                }
            }).catch(err => {
                console.log(err);
            });
        
    }, [patientid,infoIndex]);




    const handleformSubmitEvent = event => {
        event.preventDefault();
        if(infoIndex>=0){
            const newHealthData = health_Data[infoIndex];
            newHealthData.body_temperature_C = parseFloat(body_temperature_C);
            newHealthData.heart_rate = parseFloat(heart_rate);
            newHealthData.blood_pressure.systolic = parseFloat(systolic);
            newHealthData.blood_pressure.diastolic = parseFloat(diastolic);
            newHealthData.daily_motivation = daily_motivation;


            var updateHealthDataRequestBody='';
            health_Data.forEach(element => {
                updateHealthDataRequestBody += `
                    {
                        creation_time: "${element.creation_time}"
                        body_temperature_C: ${element.body_temperature_C}
                        heart_rate: ${element.heart_rate}
                        blood_pressure: {
                            systolic: ${element.blood_pressure.systolic}
                            diastolic: ${element.blood_pressure.diastolic}
                            }
                        daily_motivation: "${element.daily_motivation}"
                        },
                        `
            });

            const RequestBody = {
                query: `
                    mutation {
                        updatePatient(userid:${patientid},health_data:[${updateHealthDataRequestBody}]) {
                            userid
                        }
                    }
                `
            }

            fetch('http://localhost:4001/graphql', {
                method: 'POST',
                body: JSON.stringify(RequestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    window.alert('Failed to update patient data');
                    throw new Error('Failed!');
                }
                return res.json();
            }).then(resData => {
                console.log(resData);
                if (resData.data && resData.data.updatePatient) {
                    console.log('Patient data updated');
                    window.close();
                }
            }).catch(err => {
                window.alert('Failed to update patient data');
                console.log(err);
            });
        }
        else{
            const timetemp = new Date().toISOString().slice(0, -8).replace("T", "-").replace(":", "-");
            const newHealthData = `
                {
                    creation_time: "${timetemp}"
                    body_temperature_C: ${parseFloat(body_temperature_C)}
                    heart_rate: ${parseFloat(heart_rate)}
                    blood_pressure: {
                        systolic: ${parseFloat(systolic)}
                        diastolic: ${parseFloat(diastolic)}
                        }
                    daily_motivation: "${daily_motivation}"
                }`;
            
            var addHealthDataRequestBody='';
            health_Data.forEach(element => {
                addHealthDataRequestBody += `
                        {
                            creation_time: "${element.creation_time}"
                            body_temperature_C: ${element.body_temperature_C}
                            heart_rate: ${element.heart_rate}
                            blood_pressure: {
                                systolic: ${element.blood_pressure.systolic}
                                diastolic: ${element.blood_pressure.diastolic}
                                }
                            daily_motivation: "${element.daily_motivation}"
                            },
                            `
            });
            addHealthDataRequestBody += newHealthData;
            
                    
            const RequestBody = {
                    query: `
                        mutation {
                            updatePatient(userid:${patientid},health_data:[${addHealthDataRequestBody}]) {
                                userid
                            }
                        }
                    `
            }
            fetch('http://localhost:4001/graphql', {
                method: 'POST',
                body: JSON.stringify(RequestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    window.alert('Failed to add patient data');
                    throw new Error('Failed!');
                }
                return res.json();
            }).then(resData => {
                console.log(resData);
                if (resData.data && resData.data.updatePatient) {
                    console.log('Patient data added');
                    window.close();
                }
            }).catch(err => {
                window.alert('Failed to add patient data');
                console.log(err);
            });
        }

    }

    const getTime = () => {
        if(creation_time === ''){
            const date = new Date().toISOString().slice(0, -8);
            return date;
        } else {
            console.log('creation_time');
            console.log(creation_time);
            const dateParts = creation_time.split("-").map((part) => parseInt(part, 10));
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
            return(date.toISOString().slice(0, -8));
        }
    }


    return (
        <div className='addEditPageDiv'>
            <div className='container'>
                <h1>Add/Edit Daily Health Data</h1>
                <h3>Patient Name: {patientName}</h3>
                <h3>Patient ID: {patientid}</h3>
                <h3>Info Index: {infoIndex}</h3>
                <div>
                    <form id="addHealthDataForm" onSubmit={handleformSubmitEvent}>
                        <label for="creation_time">Creation Time:</label>
                        <input type="datetime-local" id="creation_time" name="creation_time" required value={getTime()} readOnly/><br /><br />

                        <label for="body_temperature_C">Body Temperature (C):</label>
                        <input type="number" step="0.1" id="body_temperature_C" name="body_temperature_C" required value={body_temperature_C} onChange={(event)=>setBody_temperature_C(event.target.value)}/><br /><br />

                        <label for="heart_rate">Heart Rate:</label>
                        <input type="number" id="heart_rate" name="heart_rate" required value={heart_rate} onChange={(event)=>setHeart_rate(event.target.value)}/><br /><br />

                        <label for="systolic">Systolic Blood Pressure:</label>
                        <input type="number" id="systolic" name="systolic" required value={systolic} onChange={(event)=>setSystolic(event.target.value)}/><br /><br />

                        <label for="diastolic">Diastolic Blood Pressure:</label>
                        <input type="number" id="diastolic" name="diastolic" required value={diastolic} onChange={(event)=>setDiastolic(event.target.value)}/><br /><br />

                        <label for="daily_motivation">Daily Motivation:</label>
                        <textarea id="daily_motivation" name="daily_motivation" required value={daily_motivation} onChange={(event)=>setDaily_motivation(event.target.value)}></textarea><br /><br />

                        {infoIndex>=0 ? <button type="submit">Edit Health Data</button> : <button type="submit">Add Health Data</button>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddEditDailyHealthDataPage;