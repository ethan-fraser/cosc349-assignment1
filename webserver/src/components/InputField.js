import React from 'react';

class InputField extends React.Component {

	render() {
		return (
			<div>
				<input
					className="bg-gray-100 rounded w-64 py-3 px-3 my-3 focus:outline-none border-b-4 border-gray-300 focus:border-blue-400"
					type={this.props.type}
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={ (e) => this.props.onChange(e.target.value) }
				/>
				
			</div>
		);
	}

}

export default InputField;