var SSH = require('simple-ssh');

var ssh = new SSH({
    host: '192.168.0.8',
    user: 'pi',
    pass: 'zPiPass!',
    baseDir: '/home/pi/Documents/pi4'
});

function out(stoud) {
  console.log(`LOG: `, stoud);
}

ssh
  .exec('/home/pi/.nvm/versions/node/v16.15.0/bin/node --version', {
    out,
    err: ((er) => { console.error(`er:`, er); })
  })
  .exec('/home/pi/.nvm/versions/node/v16.15.0/lib/node_modules/npm/bin/npm --version', {
    out,
    err: ((er) => { console.error(`er:`, er); })
  })
  .start();

