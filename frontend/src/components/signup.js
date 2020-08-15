import React from 'react'
import "./form.css"
import UserStore from '../stores/UserStore'


export default class App extends React.Component {
    async signup() {
        try {
            let res = await fetch('/signup', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.props.values.username,
                    email: this.props.values.email,
                    password: this.props.values.password
                })
            })
            let result = await res.json()
            if(result && result.success) {
                UserStore.isLoggedIn = true
                UserStore.username = result.username
            }
            else if(result && result.success === false) {
                this.props.values.email = ""
                this.props.values.password = ""
                alert(result.msg)
                console.log(result)
            }
        }
        catch(e) {
            console.log(e)
        }
    }



    render() {
        return (
            <div className="form-wrapper col">
                <div className="form-title">
                    <div style={{ display: this.props.values.isLogIn ? "block" : "none" }}>LOG IN</div>
                    <div style={{ display: this.props.values.isLogIn ? "none" : "block" }}>SIGN UP</div>
                </div>
                <form className="col" action="/signup" method="POST" >
                    <input required onChange={e => this.props.onChange(e)} type="text" name="username" value={this.props.values.username} placeholder="Username..." />
                    <input required onChange={e => this.props.onChange(e)} type="email" name="email" value={this.props.values.email} placeholder="Email..." />
                    <input required onChange={e => this.props.onChange(e)} type="password" name="password" value={this.props.values.password} placeholder="Password..." />
                    <input type="submit" value="Submit" onClick={this.signup} />
                </form>
            </div>
        )
    }
}