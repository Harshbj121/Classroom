import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { API } from "../config";

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Name, setName] = useState('')
    const [selectedUserId, setSelectedUserId] = useState(null);


    const fetchPost = () => {
        const token = localStorage.getItem("token")
        const user = JSON.parse(localStorage.getItem('user'))
        const classId = user.ClassroomId
        if (!token) {
            navigate('/login')
        }
        if (!classId) {
            console.error('Classroom ID is missing from user data');
            Swal.fire({
                icon: 'error',
                title: 'Classroom ID is missing from user data'
            });
            return;
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

    const handleDelete = (userId) => {
        const token = localStorage.getItem('token')
        axios.delete(`${API}/auth/deleteuser/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data); // Log success message
                alert('Post Deleted')
            })
            .catch((error) => {
                console.error('Error deleting post:', error);
                alert(error)
                // Handle error, e.g., show error message to user
            });
    }

    const handleUpdate = () => {
        if (!selectedUserId) {
            Swal.fire({
                icon: 'error',
                title: 'No user selected for update'
            });
            return;
        }
        const updatedUser = {};
        if (Name !== '') {
            updatedUser.Name = Name;
        }
        if (Email !== '') {
            updatedUser.Email = Email;
        }
        if (Password !== '') {
            updatedUser.Password = Password
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login')
        }
        axios.put(`${API}/auth/updateuser/${selectedUserId}`, updatedUser, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((result) => {
            console.log(result)
            alert('User Updated')
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Some error occured please '
            })
        })
    }


    const Register = (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"))
        const requestData = { Name: Name, Email: Email, Role: "Student", ClassroomId: user.ClassroomId, Password: Password };
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
        axios.post(`${API}/auth/register`, requestData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((result) => {
                if (result) {
                    alert(`Student added Successfully`)
                }
                setName('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: error
                })
            })
    }

    useEffect(() => {
        fetchPost()
    },[])

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }

    const createTimeTable = () => {
        console.log('Created')
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
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item me-1">
                                <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Student</button>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Student</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={Register}>
                                                <div className="modal-body">
                                                    <div className="d-flex flex-colun">
                                                        <div className="mb-3 d-flex flex-column justify-content-center me-2" style={{ fontSize: '20px' }}>
                                                            <label htmlFor="name" className="fw-bold mb-3">Name :</label>
                                                            <label htmlFor="email" className="fw-bold mb-3">Email :</label>
                                                            <label htmlFor="pass" className="fw-bold ">Password :</label>
                                                        </div>
                                                        <div className="mb-2 d-flex flex-column">
                                                            <input type="text" className="mb-3 ps-1" id="name" value={Name} onChange={e => setName(e.target.value)} />
                                                            <input type="email" className="mb-3 ps-1" id="email" value={Email} onChange={e => setEmail(e.target.value)} />
                                                            <input type="text" className="ps-1" id="pass" value={Password} onChange={e => setPassword(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="submit" className="btn btn-primary">Add</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item me-1">
                                <button className="btn btn-outline-primary" onClick={createTimeTable}>Create Time Table</button>
                            </li>
                        </ul>
                        <button className="btn btn-secondary" onClick={logout}>Logout</button>
                    </div>
                </div>
            </nav>
            <h1 className="text-center mt-4 mb-4">Welcome, !</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Classroom</th>
                        <th scope="col">Role</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No data available</td>
                        </tr>
                    ) : (data.map((data, index) => {
                        return (
                            <tr key={data._id}>
                                <th scope="row">{index}</th>
                                <td>{data.Name}</td>
                                <td>{data.Email}</td>
                                <td>{data.ClassroomId}</td>
                                <td>{data.Role}</td>
                                <td>
                                    <>
                                        <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModalu" onClick={() =>setSelectedUserId(data._id)}>Update</button>
                                        <div className="modal fade" id="exampleModalu" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title" id="exampleModalLabel">Update User</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <form onSubmit={handleUpdate}>
                                                        <div className="modal-body">
                                                            <div className="d-flex flex-colun">
                                                                <div className="mb-3 d-flex flex-column justify-content-center me-2" style={{ fontSize: '20px' }}>
                                                                    <label htmlFor="name" className="fw-bold mb-3">Name :</label>
                                                                    <label htmlFor="email" className="fw-bold mb-3">Email :</label>
                                                                    <label htmlFor="pass" className="fw-bold ">Password :</label>
                                                                </div>
                                                                <div className="mb-2 d-flex flex-column">
                                                                    <input type="text" className="mb-3 ps-1" id="name" value={Name} onChange={e => setName(e.target.value)} />
                                                                    <input type="email" className="mb-3 ps-1" id="email" value={Email} onChange={e => setEmail(e.target.value)} />
                                                                    <input type="text" className="ps-1" id="pass" value={Password} onChange={e => setPassword(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="submit" className="btn btn-primary">Update</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(data._id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default TeacherDashboard