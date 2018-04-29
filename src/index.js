import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


function makeRandomNumber(mod=17, negativeNumberProbability=10) {
    // modNumSize: 大きい数字が出る確率の調整
    let modNumSize = Math.floor(mod / (Math.random() * 100 >= 50 ? 1 : 2));
    let toNegative = (Math.random() * 100 >= negativeNumberProbability ? 1 : -1);
    return Math.floor(Math.random() * 100) % modNumSize * toNegative;
}

function initBoard(sizeX, sizeY) {
   let arr = new Array(sizeX).fill(0).map(() => {
       return new Array(sizeY).fill(0);
   });
   for (let i = 0; i < (sizeX + 1) / 2; i++) {
       for (let j = 0; j < (sizeY + 1) / 2; j++) {
           arr[i][j] = arr[i][sizeY - (j + 1)] = arr[sizeX - (i + 1)][j] = arr[sizeX - (i + 1)][sizeY - (j + 1)] = makeRandomNumber();
       }
   }
   return arr;
}

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.point}
        </button>
    );
}

function Squares(props) {
    let elements = [];

    for (let i = 0; i < props.sizeX; i++) {
        for (let j = 0; j < props.sizeY; j++) {
            elements.push(<Square point={props.pointOfGameBoard[i][j]} onClick={() => handleClick()} />);
        }
        elements.push(<br />);
    }
    return elements;
}

function handleClick() {
    return null;
}

class RefreshBoardButton extends React.Component {
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

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeX: this.props.sizeX,
            sizeY: this.props.sizeY,
            squares: ((sizeX, sizeY) => {
                return new Array(sizeX).fill(0).map(() => {
                    return new Array(sizeY).fill(0);
                });
            })(this.props.sizeX, this.props.sizeY),
            pointOfGameBoard: initBoard(this.props.sizeX, this.props.sizeY),
        }
        console.log(this.state.squares);
    }


    refreshBoard(newSizeX, newSizeY) {
        this.setState({
            sizeX: newSizeX,
            sizeY: newSizeY,
            pointOfGameBoard: initBoard(newSizeX, newSizeY)
        })
    }


    render() {
        return (
            <div>
                <Squares
                    sizeX={this.state.sizeX}
                    sizeY={this.state.sizeY}
                    pointOfGameBoard={this.state.pointOfGameBoard}
                />
                <RefreshBoardButton
                    sizeX={this.state.sizeX}
                    sizeY={this.state.sizeY}
                    onClick={this.refreshBoard.bind(this)}
                />
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <Board sizeX={12} sizeY={12} />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
