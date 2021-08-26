import React from 'react';
import { Link } from 'react-router-dom';
import InputField 	from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import UserStore 	from '../stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			buttonDisabled: false
		}
	}

    setInputValue(property, val) {
		val = val.trim();
		this.setState({
			[property]: val
		})
	}

	resetForm() {
		this.setState({
			email: '',
			password: '',
			buttonDisabled: false
		})
	}

	//API call
	async doLogin() {
		if (!this.state.email) {
			return;
		}
		if (!this.state.password) {
			return;
		}

		this.setState({
			buttonDisabled: true
		})

		try {
			let res = await fetch(API_URL + '/login', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include',
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			});
			let result = await res.json();
			if (result && result.success) {
				UserStore.isLoggedIn = true;
				UserStore.email = result.email;
                UserStore.fname = result.fname;
                UserStore.lname = result.lname;
			} else if (result && result.success === false) {
				this.resetForm();
				alert(result.msg);
			}
		} catch(e) {
			console.log(e);
			this.resetForm();
		}

	}

    render() {
        return (
            <div>
                <h1 className="text-5xl text-gray-50 font-black text-center py-9">flatbills</h1>
                <div className="w-96 mx-auto bg-gray-50 rounded-lg shadow-2xl">
                    <div>
                        <h3 className="text-2xl text-gray-800 font-semibold text-center pt-7 pb-3">Welcome to flatbills!</h3>
                        <h5 className="text-base text-gray-800 font-semibold text-center pb-4">Log in to your account.</h5><br />
                    </div>
                    <div className="text-base text-gray-800 font-regular text-center pb-7">
                        <InputField 
                            type='text'
                            placeholder='Email'
                            value={this.state.email ? this.state.email : ''}
                            onChange={ (val) => this.setInputValue('email', val) }
                        />

                        <InputField
                            type='password'
                            placeholder='Password'
                            value={this.state.password ? this.state.password : ''}
                            onChange={ (val) => this.setInputValue('password', val) }
                        />

                        <SubmitButton
                            text='Login'
                            disabled={this.state.buttonDisabled}
                            onClick={ () => this.doLogin() }
                        />
                    </div>
                </div>
                <h5 className="text-base text-gray-50 font-regular text-center my-3">Don't have an account? Register <Link to="/registerselect" className="underline">here</Link>.</h5>
            </div>
        );
    }
}

export default Login;