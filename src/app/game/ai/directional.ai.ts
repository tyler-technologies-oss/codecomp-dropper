export const northScript = `
function main(gameState, side) {
  const team = gameState.teamStates[side];
  return team.map(({coord}) => coord[0] > 0 ? 'north' : 'none');
}
`;

export const southScript = `
  function main(gameState, side) {
    const team = gameState.teamStates[side];
    const [size] = gameState.boardSize;
    return team.map(({coord}) => coord[0] < size - 1 ? 'south' : 'none');
  }
`;
