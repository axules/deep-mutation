import deepDiffEqual, { diffToHtml } from './diffEqualObjects';
import byImmutable from './exampleImmutable';
import byDMutation from './exampleDeepMutation';

document.getElementById('app').innerHTML = `
`;

console.log(byImmutable.toJS(), byDMutation);
const diff = deepDiffEqual(byImmutable.toJS(), byDMutation, '');

document.getElementById('objectTree').innerHTML = diffToHtml(diff);
