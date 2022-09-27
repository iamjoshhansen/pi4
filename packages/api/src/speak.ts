const say = require('say');

export async function speak(
  message: string,
  voice: string | null = null,
  speed = 1,
) {
  return new Promise<void>((resolve, reject) => {
    say.speak(message, voice, speed, (er: any) => {
      if (er) {
        reject(er);
      } else {
        resolve();
      }
    });
  });
}
