import { useState } from "react"
const NewActPop = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function handleLogin(e) {
        e.preventDefault()
        // Code to handle login goes here
        props.toggle()
    }

    return (

        <div className="col-sm-12" style={{ border: "0px" }}>
            <div className="popup">
                <div className="popup-inner">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <button onClick={props.toggle}>Close</button>
                </div>
            </div>
        </div>
    )
}
export default NewActPop