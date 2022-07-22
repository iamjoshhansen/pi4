const readline = require('readline');

export function ask(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>(resolve =>
    rl.question(query, (ans: string) => {
      rl.close();
      resolve(ans);
    }),
  );
}
