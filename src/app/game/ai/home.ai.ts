export const homeScript = `
let turn = -1;
function main(gameState, side) {
  turn++;
  if (turn === 0) {
    return ['south', 'east', 'south'];
  } else if (turn === 1) {
    return ['south', 'south', 'south'];
  } else if (turn === 2) {
    return ['south', 'south', 'south'];
  } else if (turn === 3) {
    return ['none', 'south', 'none'];
  } else if (turn === 4) {
    return ['south', 'west', 'south'];
  } else if (turn === 5) {
    return ['south', 'none', 'west'];
  } else if (turn === 6) {
    return ['south', 'none', 'north'];
  } else if (turn === 7) {
    return ['east', 'none', 'west'];
  } else if (turn === 8) {
    return ['east', 'none', 'none'];
  } else if (turn === 9) {
    return ['none', 'none', 'none'];
  } else if (turn > 9) {
    return ['north', 'none', 'none'];
  }
}
`;