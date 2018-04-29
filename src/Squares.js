import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';


function Square(props) {
    let state = {
        player1: null,
        player2: null
    };
    if (props.state === 0) {
        state = {
            player1: false,
            player2: false,
        }
    }
    else if (props.state === 1) {
        state = {
            player1: true,
            player2: false,
        }
    }
    else if (props.state === 2) {
        state = {
            player1: false,
            player2: true,
        }
    }

    return (
        <RaisedButton
            type="submit"
            label={props.point}
            value={[props.i, props.j]}
            primary={state.player1}
            secondary={state.player2}
            onClick={props.onClick}
        />
    );
}

export default function Squares(props) {
    let elements = []

    for (let i = 0; i < props.sizeX; i++) {
        for (let j = 0; j < props.sizeY; j++) {
            elements.push(<Square
                    i={i}
                    j={j}
                    point={props.pointOfGameBoard[i][j]}
                    state={props.stateOfGameBoard[i][j].player}
                    onClick={props.onClick}
                />);
        }
        elements.push(<br />);
    }
    return elements;
}