import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'

const AddBodyInfoPage = () => {
    const {patientid} = useParams();

    return (
        <div>
            <h1>Add Body Info Page</h1>
            <p>patientid: {patientid}</p>
        </div>
    );
}

export default AddBodyInfoPage;