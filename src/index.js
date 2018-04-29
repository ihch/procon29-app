import React from 'react';
import ReactDOM from 'react-dom';
import Squares from './Squares';
import RefreshBoardButton from './RefreshBoardButton';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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

class Game extends React.Component {
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
            <MuiThemeProvider>
                <Game sizeX={12} sizeY={12} />
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
