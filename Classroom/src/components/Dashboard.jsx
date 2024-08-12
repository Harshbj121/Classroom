import PrincipalDashboard from "./PrincipalDashboard"
import StudentDashboard from "./StudentDashboard"
import TeacherDashboard from "./TeacherDashboard"

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    // const user = { role: 'Principal' }
    console.log(user.Role)
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
