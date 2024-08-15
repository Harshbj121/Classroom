import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2'
import { API } from "../config";

const Login = () => {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        const requestData = { Email: Email, Password: Password };
        axios.post(`${API}/auth/login`, requestData)
            .then((result) => {
                if (result) {
                    console.log(result);
                    localStorage.setItem('token', result.data.result.token);
                    localStorage.setItem('user', JSON.stringify(result.data.result.user));
                    navigate('/')
                }
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: error
                })
                console.log(error)
            })
    }
    return (
        <>
            <div className="d-flex justify-content-center mt-5">
                <div className="shadow login-container pb-3">
                    <h1>Login Panel</h1>
                    <form onSubmit={handleLogin} >
                        <div className="d-flex flex-colun">
                            <div className="mb-3 d-flex flex-column justify-content-center me-2" style={{ fontSize: '20px' }}>
                                <label htmlFor="email" className="fw-bold mb-3">Email :</label>
                                <label htmlFor="pass" className="fw-bold ">Password :</label>
                            </div>
                            <div className="mb-2 d-flex flex-column">
                                <input type="email" className="mb-3 ps-1" id="email" value={Email} onChange={e => setEmail(e.target.value)} />
                                <input type="text" className="ps-1" id="pass" value={Password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login