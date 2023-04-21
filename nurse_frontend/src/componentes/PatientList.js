import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'
import  '../css/patientList.css';


const PatientListPage = () => {
    const {nurseid,nursePassword} = useParams();
    const [nurseName, setNurseName] = useState('');
    const [loginstatus, setLoginstatus] = useState(false);
    const [patientList, setPatientList] = useState([]);


    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    console.log(nurseid);
    console.log(nursePassword);


    useEffect(() => {
        const nurseauthrequestBody = {
            query: `
                mutation {
                    authenticateNurse(userid: ${nurseid}, password: "${nursePassword}") {
                        userid
                        username
                        password
                    }
                }
            `
        }
        console.log(nurseauthrequestBody);
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(nurseauthrequestBody),
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
            if (resData.data && resData.data.authenticateNurse) {
                console.log('Login successful');
                setNurseName(resData.data.authenticateNurse.username);
                setLoginstatus(true);
            }
            else{
                console.log('Login failed');
                setLoginstatus(false);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [nurseid,nursePassword]);

    useEffect(() => {
        if(loginstatus){
            const patientlistrequestBody = {
                query: `
                    query {
                        Patients {
                            userid
                            username
                        }
                    }
                `
            }
            fetch('http://localhost:4001/graphql', {
                method: 'POST',
                body: JSON.stringify(patientlistrequestBody),
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
                if (resData.data && resData.data.Patients) {
                    console.log('Get patient list successful');
                    setPatientList(resData.data.Patients);
                }
                else{
                    console.log('Get patient list failed');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, [loginstatus]);


    const handleVeiwPatient = (patient) => {
        console.log('View patient');
        console.log(patient);
        console.log(patient.userid);
        console.log(patient.username);
        setPatientId(patientId);
        setPatientName(patientName);
        document.body.classList.toggle('activeEditPatientView')
        window.location.href = `/editpatient/${patient.userid}`
    }

    
    return (
        <>
            {loginstatus ? (
                <div>
                    <div className="container">
                        <h1 className="title">{`Hello ${nurseName}`}</h1>
                        <table className='patient_table'>
                            <thead>
                                <tr>
                                    <th className='idth'>Patient ID</th>
                                    <th className='nameth'>Patient Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientList.map(patient => (
                                    <tr key={patient}>
                                        <td className='idtd'>{patient.userid}</td>
                                        <td className='nametd'>{patient.username}</td>
                                        <td><button onClick={() => handleVeiwPatient(patient)} >View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>  
                </div>
            ) : (
                <div className="container">
                    <h1 className="title">Login failed</h1>
                </div>
            )}
        </>
    );
    
}
export default PatientListPage;