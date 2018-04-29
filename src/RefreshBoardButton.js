import React from 'react';

export default class RefreshBoardButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeX: this.props.sizeX,
            sizeY: this.props.sizeY
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        return this.props.onClick(this.state.sizeX, this.state.sizeY);
    }

    handleChange(event) {
        switch (event.target.name) {
            case "sizeX":
                this.setState({sizeX: Number(event.target.value + "")});
                break;
            case "sizeY":
                this.setState({sizeY: Number(event.target.value + "")});
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div>
                <label>
                    sizeX: <input type="text" name="sizeX" value={this.state.sizeX} onChange={this.handleChange} />
                    sizeY: <input type="text" name="sizeY" value={this.state.sizeY} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Refresh" onClick={this.handleSubmit}/>
            </div>
        );
    }
}