import { useNavigate } from "react-router-dom"
import PrincipalDashboard from "./PrincipalDashboard"
import StudentDashboard from "./StudentDashboard"
import TeacherDashboard from "./TeacherDashboard"
import { useEffect } from "react"

const Dashboard = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    if (!user) {
        return null
    }
    return (
        <div>
            {user.Role === 'Principal' &&
                <PrincipalDashboard />
            }

            {user.Role === 'Student' &&
                <StudentDashboard />
            }

            {user.Role === 'Teacher' &&
                <TeacherDashboard />
            }
        </div>
    )
}

export default Dashboard
