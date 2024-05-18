import $ from 'jsr:@david/dax';
import { setupCommon } from './common.ts';
import { printResults } from './result.ts';

$.setPrintCommand(true);

await setupCommon();

printResults();
