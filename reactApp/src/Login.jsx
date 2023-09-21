import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(password);

        try {
            const response = await axios.post('URL_POR_DEFINIR', {username, password});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                <h1>Login</h1>
                <form action="">
                <div>
                    <input 
                        type="email"
                        placeholder='ejmplo@mail.com'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <label htmlFor="">Your Email</label>
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <label htmlFor="">Your Password</label>
                </div>
                <div>
                    <div>
                        <input type="checkbox" name='' id=''/>
                        <label htmlFor="Remember Me"></label>
                    </div>
                    <span>Forgot Password?</span>
                </div>
                <button type='submit' onClick={handleSubmit}>Login</button>
                <div>
                    <span>New Here? <Link to='Register'> Create an Account</Link></span>
                </div>
                </form>
            </div>
        </div>
    )
}

export default Login;