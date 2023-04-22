import React, { useState } from 'react';


const LoginPage = () => {
    const [userid, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitEventHandler = event => {
        event.preventDefault();
        const requestBody = {
            query: `
                mutation {
                    authenticatePatient(userid: ${userid}, password: "${password}") {
                        userid
                        username
                        password
                    }
                }
            `
        }
        console.log(requestBody);
        fetch('http://localhost:4001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
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
            if (resData.data && resData.data.authenticatePatient) {
                console.log('Login successful');
                window.alert('Login successful');
                window.location.href = `/patientinfo/${userid}/${password}`;
            }
            else{
                console.log('Login failed');
                window.alert('Login failed');
            }
        }).catch(err => {
            console.log(err);
        });
    }
    return (
        <div className="container">
        <h1 className="title">Login Page</h1>
        <form className="form" onSubmit={onSubmitEventHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="student-id">Nurse ID:</label>
            <input
              className="form-input"
              type="text"
              id="nurse-id"
              value={userid}
              onChange={(event) => setUserid(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password:</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    );
}
export default LoginPage;