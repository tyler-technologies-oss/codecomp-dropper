export const wanderScript = `
function main(gameState, side) {
  const myTeam = gameState.teamStates[side];
  const possibleMoves = [];
  const [rowSize, colSize] = gameState.boardSize;
  console.log('sizes', rowSize, colSize);
  return myTeam.reduce((moveSet, member) => {
    if (member.isDead) {
      moveSet.push('none');
    } else {
      possibleMoves.push('none');
      const [row, col] = member.coord;
      console.log(row, col);
      if (row > 1) possibleMoves.push('north');
      if (row < rowSize - 1)  possibleMoves.push('south');
      if (col > 1) possibleMoves.push('west');
      if (col < colSize - 1)  possibleMoves.push('east');
      moveSet.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
      possibleMoves.length = 0;
    }
    return moveSet;
  }, [])
}
`;
