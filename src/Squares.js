import React from 'react';


function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.point}
        </button>
    );
}

export default function Squares(props) {
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