import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { API } from "../config";

const PrincipalDashboard = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([]);
    const [Email, setEmail] = useState('');
    const [ClassroomId, setClassroomId] = useState('');
    const [Role, setRole] = useState('');
    const [Password, setPassword] = useState('');
    const [Name, setName] = useState('')
    const [StartTime, setStartTime] = useState('')
    const [EndTime, setEndTime] = useState('')
    const [Day, setDay] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [TeacherId, setTeacherId] = useState('')

    const handleDayChange = (e) => {
        const value = e.target.value;
        setDay(prevDays =>
            prevDays.includes(value)
                ? prevDays.filter(day => day !== value)
                : [...prevDays, value]
        );
    };

    const fetchPost = () => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate('/login')
        }
        axios.get(`${API}/auth/alldata`, {
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

    const handleDelete = (id) => {
        const token = localStorage.getItem('token')
        axios.delete(`${API}/auth/deleteuser/${id}`, {
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
        if (Role !== '') {
            updatedUser.Role = Role
        }
        if (Password !== '') {
            updatedUser.Password = Password
        }
        if (ClassroomId !== '') {
            updatedUser.ClassroomId = ClassroomId
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
            Swal.fire({
                icon: 'success',
                title: "User info updated"
            })
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Some error occured please '
            })
        })
    }

    const addClassroom = () => {
        const requestData = { Name: Name, StartTime: StartTime, EndTime: EndTime, Day: Day, TeacherId: TeacherId };
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login')
        }
        axios.post(`${API}/api/createclassroom`, requestData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((result) => {
                if (result) {
                    alert(`Class created Successfully`)
                }
                setName('')
                setEndTime('')
                setStartTime('')
                setDay('')
            })
            .catch((error) => {
                console.log(error);
                alert(error)
            })
    }
    const Register = () => {
        const requestData = { Name: Name, Email: Email, Role: Role, Password: Password };
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
        axios.post(`${API}/auth/register`, requestData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((result) => {
            if (result) {
                alert(`${Role} added Successfully`)
            }
            setName('');
            setEmail('');
            setPassword('');
            setRole('')
        })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: error
                })
            })
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }
    useEffect(() => {
        fetchPost()
    })

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
                                <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">Register</button>
                                <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title" id="exampleModalLabel">Registration</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={Register}>
                                                <div className="modal-body">
                                                    <div className="d-flex flex-colun">
                                                        <div className="mb-3 d-flex flex-column justify-content-center me-2" style={{ fontSize: '20px' }}>
                                                            <label htmlFor="name" className="fw-bold mb-3">Name :</label>
                                                            <label htmlFor="email" className="fw-bold mb-3">Email :</label>
                                                            <label htmlFor="role" className="fw-bold mb-3">Role :</label>
                                                            <label htmlFor="pass" className="fw-bold ">Password :</label>
                                                        </div>
                                                        <div className="mb-2 d-flex flex-column">
                                                            <input type="text" className="mb-3 ps-1" id="name" value={Name} onChange={e => setName(e.target.value)} />
                                                            <input type="email" className="mb-3 ps-1" id="email" value={Email} onChange={e => setEmail(e.target.value)} />
                                                            <select id="role" className="form-select mb-3 ps-1" value={Role} onChange={e => setRole(e.target.value)} >
                                                                <option value="" disabled>Select a role</option>
                                                                <option value="Student">Student</option>
                                                                <option value="Teacher">Teacher</option>
                                                            </select>
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
                            <li className="nav-item ">
                                <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Create Classroom</button>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Classroom</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form onSubmit={addClassroom}>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="mb-3">
                                                                <label htmlFor="classname" className="form-label fw-bold">Class Name:</label>
                                                                <input type="text" className="form-control" id="classname" value={Name} onChange={e => setName(e.target.value)} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="start" className="form-label fw-bold">Start Time:</label>
                                                                <input type="text" className="form-control" id="start" value={StartTime} onChange={e => setStartTime(e.target.value)} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="end" className="form-label fw-bold">End Time:</label>
                                                                <input type="text" className="form-control" id="end" value={EndTime} onChange={e => setEndTime(e.target.value)} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="tid" className="form-label fw-bold">Teacher ID:</label>
                                                                <input type="text" className="form-control" id="tid" value={TeacherId} onChange={e => setTeacherId(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <fieldset className="mb-3">
                                                                <legend className="form-label fw-bold">Select days of the week:</legend>
                                                                <div className="d-flex flex-wrap">
                                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                                        <div key={day} className="form-check me-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={day}
                                                                                value={day}
                                                                                checked={Day.includes(day)}
                                                                                onChange={handleDayChange}
                                                                                className="form-check-input"
                                                                            />
                                                                            <label htmlFor={day} className="form-check-label">{day}</label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </fieldset>
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
                        </ul>
                        <button className="btn btn-secondary" onClick={logout}>Logout</button>
                    </div>
                </div>
            </nav>
            <h1 className="text-center mt-4 mb-4">Welcome, Principal!</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Classroom</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center"><h3>No data available</h3></td>
                        </tr>
                    ) : (data.map((data, index) => {
                        return (
                            <tr key={data._id}>
                                <th scope="row">{index}</th>
                                <td>{data.Name}</td>
                                <td>{data.Email}</td>
                                <td>{data.Role}</td>
                                <td>{data.ClassroomId}</td>
                                <td>
                                    <>
                                        <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModalu" onClick={() => setSelectedUserId(data._id)}>Update</button>
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
                                                                    <label htmlFor="role" className="fw-bold mb-3">Role :</label>
                                                                    <label htmlFor="classroom" className="fw-bold mb-3">ClassroomId :</label>
                                                                    <label htmlFor="pass" className="fw-bold ">Password :</label>
                                                                </div>
                                                                <div className="mb-2 d-flex flex-column">
                                                                    <input type="text" className="mb-3 ps-1" id="name" value={Name} onChange={e => setName(e.target.value)} />
                                                                    <input type="email" className="mb-3 ps-1" id="email" value={Email} onChange={e => setEmail(e.target.value)} />
                                                                    <select id="role" className="form-select mb-3 ps-1" value={Role} onChange={e => setRole(e.target.value)} >
                                                                        <option value="" disabled>Select a role</option>
                                                                        <option value="Student">Student</option>
                                                                        <option value="Teacher">Teacher</option>
                                                                    </select>
                                                                    <input type="text" className="mb-3 ps-1" id="classroom" value={ClassroomId} onChange={e => setClassroomId(e.target.value)} />
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

export default PrincipalDashboard