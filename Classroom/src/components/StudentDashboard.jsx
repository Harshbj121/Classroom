import { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

const StudentDashboard = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))

    const fetchPost = () => {
        const token = localStorage.getItem("token")
        const user = JSON.parse(localStorage.getItem('user'))
        const classId = user.ClassroomId
        if (!token) {
            navigate('/login')
        }
        axios.get(`${API}/auth/alldata/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((result) => {
                if (result && result.data && result.data.dbPosts) {
                    const posts = result.data.dbPosts
                    setData(posts);
                } else {
                    navigate('/login')
                }
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: error
                });
            })
    }

    useEffect(()=>{
        fetchPost()
    })

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold" href="#">Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="ms-auto me-3">
                            <button className="btn btn-secondary" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <h1 className="text-center mt-4 mb-4">Welcome, {user.Name}!</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Classroom</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">No data available</td>
                        </tr>
                    ) : (data.map((data, index) => {
                        return (
                            <tr key={data._id}>
                                <th scope="row">{index}</th>
                                <td>{data.Name}</td>
                                <td>{data.Email}</td>
                                <td>{data.Classroom}</td>
                            </tr>
                        )})
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default StudentDashboard