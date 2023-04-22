import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'

const UserinfoPage = () => {
    const {patientid} = useParams();
    const [patientName, setPatientName] = useState('');
    const [healthData, setHealthData] = useState([]);
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
                throw new Error('Get patient list Failed!');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            if (resData.data && resData.data.PatientById) {
                console.log('Get patient list successful');
                setPatientName(resData.data.PatientById.username);
                setHealthData(resData.data.PatientById.health_data);
                setDaily_motivation(resData.data.PatientById.health_data[resData.data.PatientById.health_data.length-1].daily_motivation)
            }
            else{
                console.log('Get patient list failed');
            }
        }).catch(err => {
            console.log(err);
        });
    }, [patientid]);
    function renderTable(healthData){
        return healthData.map((healthdata, index) => {
            return (
                <tr key={index}>
                    {/* {console.log(healthData[index])} */}
                    <td className='tab'>{index}</td>
                    <td>{healthdata.creation_time}</td>
                    <td>{bodyTemperatureBackgroundColor(healthdata.body_temperature_C)}</td>
                    <td className='tab'>{healthdata.heart_rate}</td>
                    <td className='tab'>{healthdata.blood_pressure.systolic}</td>
                    <td className='tab'>{healthdata.blood_pressure.diastolic}</td>
                </tr>
            )
        })
    }

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


    const addBtnClick = () => {
        console.log('addBtnClick');
        window.open(`/addbodyinfo/${patientid}`, "_blank");
    }

return (
        <div className='PatientInfoDiv'>
            <div className='helloDiv'>
                <h1>{`Hello ${patientName}`}</h1>
                <h3>{`User id ${patientid}`}</h3>
                <h3>{`Daily motivational words:\t ${daily_motivation}`}</h3>
                <button onClick={addBtnClick} >Add daily body info</button>
            </div>
            <div className='healthDataDiv'>
                <h2>Health Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Creation Time</th>
                            <th>Body Temperature</th>
                            <th>Heart Rate</th>
                            <th>Blood Pressure(systolic)</th>
                            <th>Blood Pressure(diastolic)</th>
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

export default UserinfoPage;