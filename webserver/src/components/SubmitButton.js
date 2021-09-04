import React from 'react';

class SubmitButton extends React.Component {

	render() {
		return (
			<div>
				<button
                    type="button"
					className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-64 py-3 px-3 my-3"
					disabled={this.props.disabled}
					onClick={ () => this.props.onClick() }
				>
					{this.props.text}
				</button>
			</div>
		);
	}

}

export default SubmitButton;