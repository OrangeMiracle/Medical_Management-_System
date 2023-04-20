import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'

const PatientListPage = () => {
    const [nurseid, setNurseid] = useState('');
    const [nurseName, setNurseName] = useState('');
    const [patientList, setPatientList] = useState([]);
    const [patientId, setPatientId] = useState('');


    