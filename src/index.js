import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

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
    console.log("hogehoge");

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

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: ((sizeX, sizeY) => {
                return new Array(sizeX).fill(0).map(() => {
                    return new Array(sizeY).fill(0);
                });
            })(this.props.sizeX, this.props.sizeY),
            pointOfGameBoard: initBoard(this.props.sizeX, this.props.sizeY),
        }
        console.log(this.state.squares);
    }

    render() {
        return (
            <Squares sizeX={this.props.sizeX} sizeY={this.props.sizeY} pointOfGameBoard={this.state.pointOfGameBoard} />
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <Board sizeX={4} sizeY={7} />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
