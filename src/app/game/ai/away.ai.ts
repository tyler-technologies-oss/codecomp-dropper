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
  } else if (turn === 5) {
    return ['none', 'east', 'none'];
  } else if (turn === 6) {
    return ['none', 'south', 'none'];
  } else if (turn === 7) {
    return ['none', 'south', 'none'];
  } else if (turn === 8) {
    return ['none', 'west', 'none'];
  } else if (turn === 9) {
    return ['none', 'west', 'none'];
  } else if (turn === 10) {
    return ['none', 'none', 'none'];
  } else if (turn > 10)  {
    return ['none', 'north', 'none'];
  }
}
`;