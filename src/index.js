import React from 'react';
import ReactDOM from 'react-dom';
import Squares from './Squares';
import RefreshBoardButton from './RefreshBoardButton';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import registerServiceWorker from './registerServiceWorker';


function makeRandomNumber(mod=17, negativeNumberProbability=10) {
    // modNumSize: 大きい数字が出る確率の調整
    let modNumSize = Math.floor(mod / (Math.random() * 100 >= 50 ? 1 : 2));
    let toNegative = (Math.random() * 100 >= negativeNumberProbability ? 1 : -1);
    return Math.floor(Math.random() * 100) % modNumSize * toNegative;
}

function initBoardPoint(sizeX, sizeY) {
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

function initBoardState(sizeX, sizeY, gameTurn, firstStayGrid=null) {
    let arr =  new Array(gameTurn + 1).fill(0).map(() => {
        return new Array(sizeX).fill(0).map(() => {
            return Array(sizeY).fill({player: null});
        });
    });

    if (firstStayGrid !== null) {
        arr[0][firstStayGrid[0][0]][firstStayGrid[0][1]] = {player: 1};
        arr[0][firstStayGrid[1][0]][firstStayGrid[1][1]] = {player: 1};
        arr[0][firstStayGrid[2][0]][firstStayGrid[2][1]] = {player: 2};
        arr[0][firstStayGrid[3][0]][firstStayGrid[3][1]] = {player: 2};
    }

    return arr;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeX: this.props.sizeX,
            sizeY: this.props.sizeY,
            gameTurn: this.props.gameTurn,
            countTurn: 0,
            nowSelector: true,
            cannotSelectGrid: false,
            squares: ((sizeX, sizeY) => {
                return new Array(sizeX).fill(0).map(() => {
                    return new Array(sizeY).fill(0);
                });
            })(this.props.sizeX, this.props.sizeY),
            pointOfGameBoard: initBoardPoint(this.props.sizeX, this.props.sizeY),
            stateOfGameBoard: initBoardState(this.props.sizeX, this.props.sizeY, this.props.gameTurn, this.props.firstStayGrid),
            clickedGridCache: [],
            playerStayGridNow: this.props.firstStayGrid,
        }
    }

    initStayPlayerGrid(sizeX, sizeY, gameTurn=120) {
        let x = Math.floor(Math.random() * 100) % Math.floor(sizeX / 2);
        let y = Math.floor(Math.random() * 100) % Math.floor(sizeY / 2);
        let arr =  [
            [y, x],
            [sizeY - y - 1, sizeX - x - 1],
            [sizeY - y - 1, x],
            [y, sizeX - x - 1]
        ];

        // 最初の盤面に反映
        let board = initBoardState(sizeX, sizeY, gameTurn);
        for (let i = 0; i < 4; i++) {
            board[0][arr[i][0]][arr[i][1]] = {player: i <= 1 ? 1 : 2};
        }
        this.setState({stateOfGameBoard: board});
        return arr;
    }

    isAroundGrid(selectGrid, nowGrids, counter) {
        let flg = false;
        const dx = [0, 1, 1, 1, 0, -1, -1, -1];
        const dy = [1, 1, 0, -1, -1, -1, 0, 1];

        for (let i = Math.floor(counter / 2) * 2; i < Math.floor(counter / 2) * 2 + 2; i++) {
            for (let j = 0; j < 8; j++) {
                if (selectGrid[0] === nowGrids[i][0] + dy[j] && selectGrid[1] === nowGrids[i][1] + dx[j]) {
                    flg = true;
                    let stateCopy = Object.assign({}, this.state.playerStayGridNow);
                    stateCopy[i] = [null, null]
                    this.setState({playerStayGridNow: stateCopy});
                    return flg
                }
            }
        }
    }


    refreshBoard(newSizeX, newSizeY) {
        this.setState({
            sizeX: newSizeX,
            sizeY: newSizeY,
            countTurn: 0,
            pointOfGameBoard: initBoardPoint(newSizeX, newSizeY),
            stateOfGameBoard: [],
            playerStayGridNow: [],
            nowSelector: true,
            clickedGridCache: [],
        });
        this.setState({playerStayGridNow: this.initStayPlayerGrid(newSizeX, newSizeY)});
    }


    handleClickSquare(event) {
        var index = event.target.value.split(",").map((n) => Number(n));
        this.setState({cannotSelectGrid: false});
        if (!this.isAroundGrid(index, this.state.playerStayGridNow, this.state.clickedGridCache.length)) {
            console.log("isAround: ", this.isAroundGrid(index, this.state.playerStayGridNow[this.state.clickedGridCache.length]));
            this.setState({cannotSelectGrid: true});
            return;
        }

        this.state.clickedGridCache.push(index);

        if (this.state.clickedGridCache.length === 2) {
            this.setState({nowSelector: !this.state.nowSelector});
        }

        if (this.state.clickedGridCache.length === 4) {
            let stateCopy = Object.assign([], this.state);
            stateCopy.stateOfGameBoard[stateCopy.countTurn + 1] = Object.assign({}, stateCopy.stateOfGameBoard[stateCopy.countTurn]);
            for (let i = 0; i < 4; i++) {
                let index = this.state.clickedGridCache[i];
                stateCopy.stateOfGameBoard[stateCopy.countTurn + 1][index[0]][index[1]] = {player: (i === 0 || i === 1) ? 1 : 2};
            }
            stateCopy.countTurn += 1;
            stateCopy.playerStayGridNow = Object.assign([], stateCopy.clickedGridCache);
            stateCopy.clickedGridCache = [];
            this.setState(stateCopy);
            // なぜかここでもnowSelectorを更新しないといけない
            this.setState({nowSelector: !this.state.nowSelector});
        }

        if (this.state.gameTurn === this.countTurn) {
            this.setState({playerStayGridNow: [new Array(4).fill(0).map(() => { return [null, null]; })]});
            // ゲーム終了処理wo書きましょう
        }
    }


    render() {
        return (
            <div>
                <Squares
                    sizeX={this.state.sizeX}
                    sizeY={this.state.sizeY}
                    pointOfGameBoard={this.state.pointOfGameBoard}
                    stateOfGameBoard={this.state.stateOfGameBoard[this.state.countTurn]}
                    onClick={this.handleClickSquare.bind(this)}
                />
                <RefreshBoardButton
                    sizeX={this.state.sizeX}
                    sizeY={this.state.sizeY}
                    onClick={this.refreshBoard.bind(this)}
                />
                <RaisedButton
                    label="Now Player"
                    primary={this.state.nowSelector}
                    secondary={!this.state.nowSelector}
                />
                <Snackbar
                    open={this.state.cannotSelectGrid}
                    message="そこには進めません"
                    autoHideDuration={2000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Game sizeX={12} sizeY={12} gameTurn={(makeRandomNumber(61, 0) + 60)} firstStayGrid={[ [3, 3], [12 - 3 - 1, 12 - 3 - 1], [12 - 3 - 1, 3], [3, 12 - 3 - 1] ]}  />

            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
