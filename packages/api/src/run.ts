import { green, inverse } from 'colors';
import { readFileSync, writeFileSync } from 'fs';
import { getBooks } from './get-books';
// import * as groupBy from 'lodash.groupby';
// const groupBy = require('lodash.groupby');
import groupBy = require('lodash.groupby');
import { mapValues } from './map-values';

console.log(`Hello Library\n`);

(async () => {
  const [card, pin] = readFileSync('./.env/josh.txt').toString().split('\n');
  // console.log({ card, pin });
  const books = await getBooks(card, pin);

  const grouped = mapValues(groupBy(books, 'due'), books =>
    books.map(book => book.title),
  );

  // console.log({ books, grouped });

  let output = `# Books\n`;
  Object.keys(grouped).forEach(date => {
    output += `\n## ${date}\n\n`;
    const books = grouped[date];
    books.forEach(book => (output += `- [ ] ${book}\n`));
  });

  const savePath = './result.md';
  writeFileSync(savePath, output);

  console.log(`Saved to ${savePath}`);
  console.log(inverse(green(' Done ')));
})();
