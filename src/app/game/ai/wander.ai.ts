export const wanderScript = `
function main(gameState, side) {
  const myTeam = gameState.teamStates[side];
  const possibleMoves = [];
  return myTeam.reduce((moveSet, member) => {
    if (member.isDead) {
      moveSet.push('none');
    } else {
      possibleMoves.push('none');
      const [row, col] = member.coord;
      if (row - 1 >= 0) possibleMoves.push('north');
      if (row + 1 < 3)  possibleMoves.push('south');
      if (col - 1 >= 0) possibleMoves.push('west');
      if (col + 1 < 3)  possibleMoves.push('east');
      moveSet.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
      possibleMoves.length = 0;
    }
    return moveSet;
  }, [])
}
`;
