import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'
import  '../css/editpatient.css';

const EditPaitentPage = () => {
    const {patientid} = useParams();

    const [patientName, setPatientName] = useState('');
    const [healthData, setHealthData] = useState([]);

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
                console.log('Patient data retrieved');
                setPatientName(resData.data.PatientById.username);
                setHealthData(resData.data.PatientById.health_data);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [patientid]);


    function bodyTemperatureBackgroundColor(bodyTemperature){
        if(bodyTemperature >= 36.5 && bodyTemperature <= 37.5){//normal body temperature
            return (<div className='BodyTempDiv' id='normalBodyTempDiv'>{bodyTemperature}</div>)
        }
        else if(bodyTemperature < 36.5){//low body temperature
            return (<div className='BodyTempDiv' id='lowBodyTempDiv'>{bodyTemperature}</div>)
        }
        else if(bodyTemperature > 37.5 && bodyTemperature <= 38){//Low-grade fever
            return (<div className='BodyTempDiv' id='lowFeverBodyTempDiv'>{bodyTemperature}</div>)
        }
        else if(bodyTemperature > 38 && bodyTemperature <= 39){//Mid-grade fever
            return (<div className='BodyTempDiv' id='midFeverBodyTempDiv'>{bodyTemperature}</div>)
        }
        else if(bodyTemperature > 39){//High-grade fever
            return (<div className='BodyTempDiv' id='highFeverBodyTempDiv'>{bodyTemperature}</div>)
        }
        else{
            return (<div className='BodyTempDiv' id='normalBodyTempDiv'>{bodyTemperature}</div>)
        }
    }

    function renderTable(healthData){
        return healthData.map((healthdata, index) => {
            return (
                <tr key={index}>
                    {console.log(healthData[index])}
                    <td className='tab'>{index}</td>
                    <td>{healthdata.creation_time}</td>
                    <td>{bodyTemperatureBackgroundColor(healthdata.body_temperature_C)}</td>
                    <td className='tab'>{healthdata.heart_rate}</td>
                    <td className='tab'>{healthdata.blood_pressure.systolic}</td>
                    <td className='tab'>{healthdata.blood_pressure.diastolic}</td>
                    <td><button onClick={()=>editBtnClick(index)}>Edit</button></td>
                </tr>
            )
        })
    }



    const editBtnClick = (infoIndex) => {
        console.log('editBtnClick');
        console.log(infoIndex);
        window.open(`/addeditdailyhealthdata/${patientid}/${infoIndex}`, '_blank');

    }
    const addBtnClick = () => {
        console.log('addBtnClick');
        window.open(`/addeditdailyhealthdata/${patientid}/-1`, '_blank');
    }

    return (
        <div className='editPatientPageDiv'>
            <div className='container'>
                <h1>Edit Patient Page</h1>
                <h3>Patient Name: {patientName}</h3>
                <h3>Patient ID: {patientid}</h3>
                <button onClick={addBtnClick} >Add</button>
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Creation Time</th>
                            <th>Body Temperature</th>
                            <th>Heart Rate</th>
                            <th>Blood Pressure(systolic)</th>
                            <th>Blood Pressure(diastolic)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTable(healthData)}
                    </tbody>
                </table>
            </div>
        </div>
    );


}
export default EditPaitentPage;