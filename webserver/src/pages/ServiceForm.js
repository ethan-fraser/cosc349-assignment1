import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import InputField 	from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import UserStore 	from '../stores/UserStore';
//import Dashboard    from './Dashboard';

const API_URL = "http://192.168.2.12:3000";

class ServiceForm extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			billName: '',
			billDate: '',
            billAmount: 0,
			buttonDisabled: false,
            filledService: false // Whether or not the service form has been filled
		}
	}

    setInputValue(property, val) {
		//val = val.trim();
		this.setState({
			[property]: val
		})
	}

	resetForm() {
		this.setState({
			billName: '',
			billDate: '',
            billAmount: 0,
			buttonDisabled: false,
            filledService: false
		})
	}

    // Instructions for when "done" button is pressed
	async doDone() {
        // If these properties are not filled, return immediately
		if (!this.state.billName) {
			return;
		}
		if (!this.state.billDate) {
			return;
		}
        if (!this.state.billAmount) {
			return;
		}

		this.setState({
			buttonDisabled: true
		})

        // API calls to dbserver
		try {
			let res = await fetch(API_URL + '/service', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include',
				body: JSON.stringify({
					billName: this.state.billName,
					billDate: this.state.billDate,
                    billAmount: this.state.billAmount,
				})
			});
			let result = await res.json();
			if (result && result.success) {
				UserStore.bills.add({
                    id: result.id,
                    name: result.billName,
                    date: result.billDate,
                    amount: result.billAmount,
                })
                this.setState({ filledService: true})
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
        // If service form is filled, go back to dashboard
        if (this.state.filledService) {
            return (
                <Redirect to="/dashboard" />
            )
        }

        return (
            <div className="bg-gray-50 min-h-screen">
                <nav className="bg-blue-400 flex flex-row">
                    <h1 className="text-3xl text-gray-50 font-black text-left py-3 pl-5"><Link to="/dashboard">flatbills</Link></h1>
                    <button className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"><Link to="/login">Logout</Link></button>                
                </nav>
                <div className="flex flex-row pt-10 items-center">
                    <div className="mx-auto mr-1">
                        <h3 className="text-2xl text-gray-800 font-semibold text-left py-3 px-3">Add a New Bill</h3>
                        <div className="text-base text-gray-800 font-regular text-center">
                            <InputField 
                                type='text'
                                placeholder='Bill name eg WiFi'
                                value={this.state.billName ? this.state.billName : ''}
                                onChange={ (val) => this.setInputValue('billName', val) }
                            />

                            <InputField
                                type='number'
                                placeholder='Bill amount'
                                value={this.state.billAmount ? this.state.billAmount : ''}
                                onChange={ (val) => this.setInputValue('billAmount', val) }
                            />

                            <InputField
                                type='date'
                                placeholder='Bill due date'
                                value={this.state.billDate ? this.state.billDate : ''}
                                onChange={ (val) => this.setInputValue('billDate', val) }
                            />

                            <SubmitButton
                                text='Done'
                                disabled={this.state.buttonDisabled}
                                onClick={ () => this.doDone() }
                            />

                            <Link to="/dashboard">
                                <button className="font-semibold text-white bg-gray-300 hover:bg-gray-200 rounded w-64 py-3 px-3 my-3">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                    <img src='/undraw_transfer_money_rywa.svg' alt="No input" width="300" height="218.1" className="mx-auto"></img>
                </div>
            </div>
        );
    }
}

export default ServiceForm;