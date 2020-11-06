export const awayScript = `
let turn = -1;
function main(gameState, side) {
  turn++;
  if (turn === 0) {
    return ['east', 'north', 'west'];
  } else if (turn === 1) {
    return ['north', 'north', 'north'];
  } else if (turn === 2) {
    return ['north', 'north', 'north'];
  }  else if (turn === 3) {
    return ['north', 'none', 'north'];
  } else if (turn === 4) {
    return ['west', 'north', 'east'];
  } else if (turn > 4)  {
    return ['north', 'north', 'north'];
  }
}
`;