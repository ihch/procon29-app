import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const propTypes = {
    onClick: PropTypes.func
}

function makeRandomNumber(mod=17, NegativeNumberProbability=20) {
    // mod is decided 16 by kosen procon29 rule book.
    // NegativeNumberProbability is a any number of integer.
    return Math.floor(Math.random() * 100) % mod * (Math.random() * 100 >= 20 ? 1 : -1);
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
        this.state = {};
    }

    clickHandler() {
        return this.props.onClick();
    }

    render() {
        return (
            <button onClick={() => {this.clickHandler()}}>
                refresh
            </button>
        );
    };
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


    refreshBoard() {
        this.setState({pointOfGameBoard: initBoard(this.state.sizeX, this.state.sizeY)})
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
                    // onClick={() => {this.setState({
                    //     pointOfGameBoard: initBoard(this.state.sizeX, this.state.sizeY)
                    // })}}
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
