import {useContext, useState} from "react"
import { AuthContext } from "../context/AuthContext"

function LogInPage() {
    const [user, setUser] = useState({username: "", password: ""})
    const {login} = useContext(AuthContext)
    
    const handleChange = (e) => setUser({...user, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(user)
            window.location.href = '/profile'
        } catch (err) {
            alert(err.response.data.error)
        }
    }

    return (
        <div>
            <h1>Welcome back to New Liyanage Hardware!</h1>
            <form onSubmit={handleSubmit}>
                <input name="username" onChange={handleChange} placeholder="Username" required />
                <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LogInPage