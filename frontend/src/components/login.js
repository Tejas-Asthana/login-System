import React from 'react'
import UserStore from '../stores/UserStore'
import "./form.css"


export default class App extends React.Component {
    async doLogin() {
        try {
            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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
            }
        }
        catch(e) {
            console.log(e)
            this.props.values.email = ""
            this.props.values.password = ""
        }
    }

    render() {
        return (
            <div className="form-wrapper col">
                <div className="form-title">
                    <div style={{ display: this.props.values.isLogIn ? "block" : "none" }}>LOG IN</div>
                    <div style={{ display: this.props.values.isLogIn ? "none" : "block" }}>SIGN UP</div>
                </div>
                {/* <form className="col" action="/login" method="POST"> */}
                    <input required id="email" onChange={e => this.props.onChange(e)} type="email" name="email" value={this.props.values.email} placeholder="Email..." />
                    <input required id="password" onChange={e => this.props.onChange(e)} type="password" name="password" value={this.props.values.password} placeholder="Password..." />
                    <input type="submit" value="submit" onClick={() => this.doLogin()}/>
                {/* </form> */}
            </div>
        )
    }
}

