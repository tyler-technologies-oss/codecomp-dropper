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
  } else if (turn > 4) {
    return ['south', 'south', 'south'];
  }
}
`;