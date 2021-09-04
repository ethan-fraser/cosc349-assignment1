import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import InputField 	from '../components/InputField';
import SubmitButton from '../components/SubmitButton';

const API_URL = "http://192.168.2.12:3000";

function FlatManager(props) {
    return (
        <InputField 
            type='text'
            placeholder='Flat Name'
            value={props.register.state.flatName ? props.register.state.flatName : ''}
            onChange={ (val) => props.register.setInputValue('flatName', val) }
        />
    );
}

function FlatMember(props) {
    return (
        <InputField 
            type='text'
            placeholder='Flat Signup Code'
            value={props.register.state.flatCode ? props.register.state.flatCode : ''}
            onChange={ (val) => props.register.setInputValue('flatCode', val) }
        />
    );
}

class Register extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
            firstName: '',
            lastName: '',
            flatName: '',
            flatCode: '',
            isFlatManager: false,
			buttonDisabled: false,
		}
	}

    setInputValue(property, val) {
		//val = val.trim(); // commented out so that it doesn't cut out spaces for the flat name
		this.setState({
			[property]: val
		})
	}

	resetForm() {
		this.setState({
			email: '',
			password: '',
            firstName: '',
            lastName: '',
            flatName: '',
            flatCode: '',
			buttonDisabled: false,
            isFlatManager: false
		})
	}

    onChange = e => {
        this.setState({isFlatManager: e.target.checked})
    }

    // Instructions for when "next" button is pressed
	async doNext() {
        // If these properties aren't filled, return immediately
		if (!this.state.email) {
			return;
		}
		if (!this.state.password) {
			return;
		}
        if (!this.state.firstName) {
			return;
		}
        if (!this.state.lastName) {
			return;
		}
        if (this.state.isFlatManager) {
            if (!this.state.flatName) {
                return;
            }
        } else {
            if (!this.state.flatCode) {
                return;
            }
        }

        // Set button's state to true
		this.setState({
			buttonDisabled: true
		})

        // API calls to the dbserver
		try {
			let res = await fetch(API_URL + '/registerUser', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include', // Satisfies CORS requirements
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    flatName: this.state.flatName,
                    flatCode: this.state.flatCode,
                    isFlatManager: this.state.isFlatManager,
				})
			});
			let result = await res.json();
			if (result && result.success) {
                this.setState({ isLoggedIn: true })
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
        if (this.state.isLoggedIn) {
            return (
                <Redirect to="/dashboard" />
            )
        }
        
        const isFlatManager = this.state.isFlatManager;
        let inputFlat;
        if (isFlatManager) {
            inputFlat = <FlatManager register={this} />;
        } else {
            inputFlat= <FlatMember register={this} />;
        }

        return (
            <div className="grid place-items-center">
                <h1 className="text-5xl text-gray-50 font-black text-center py-9">flatbills</h1>
                <div className="w-max h-auto mx-auto bg-gray-50 rounded-lg shadow-2xl">
                    <div>
                        <h3 className="text-2xl text-gray-800 font-semibold text-center pt-7 pb-3">Join flatbills!</h3>
                        <h5 className="text-base text-gray-800 font-semibold text-center pb-4">Create an account to manage your flat bills.</h5><br />
                    </div>
                    <form>
                        <div className="text-base text-gray-800 font-regular text-center pb-7 flex flex-row mx-14">
                            <div>
                                <InputField 
                                    type='text'
                                    placeholder='Email'
                                    value={this.state.email ? this.state.email : ''}
                                    onChange={ (val) => this.setInputValue('email', val) }
                                />
                                <InputField 
                                    type='text'
                                    placeholder='First Name'
                                    value={this.state.firstName ? this.state.firstName : ''}
                                    onChange={ (val) => this.setInputValue('firstName', val) }
                                />
                                <label>
                                    Are you a flat manager?
                                    <input type="checkbox"
                                        checked={isFlatManager}
                                        onChange={this.onChange}
                                        className="ml-2"
                                    ></input>
                                </label>
                                {inputFlat}
                            </div>
                            <div>
                                <InputField
                                    type='password'
                                    placeholder='Password'
                                    value={this.state.password ? this.state.password : ''}
                                    onChange={ (val) => this.setInputValue('password', val) }
                                />
                                <InputField 
                                    type='text'
                                    placeholder='Last Name'
                                    value={this.state.lastName ? this.state.lastName : ''}
                                    onChange={ (val) => this.setInputValue('lastName', val) }
                                />
                                <div className="mt-6"></div>
                                <SubmitButton
                                    text='Next'
                                    disabled={this.state.buttonDisabled}
                                    onClick={ () => this.doNext() }
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <h5 className="text-base text-gray-50 font-regular text-center my-3">Already have an account? Log in <Link to="/login" className="underline">here</Link>.</h5>
            </div>
        );
    }
}

export default Register;