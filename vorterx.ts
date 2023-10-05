import cluster from 'cluster';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

let isRunning = false;

function start(this: any, file: string) {
  if (isRunning) return;
  isRunning = true;
  let args = [path.join(__dirname, file), ...process.argv.slice(2)];

  cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
  });

  let p = cluster.fork();

  p.on('message', (data) => {
        console.log('[RECEIVED]', data);
        switch (data) {
        case 'reset':
        p.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
        case 'uptime':
        p.send(process.uptime());
        break;
     }
    });

    p.on('exit', (code) => {
    isRunning = false;
    console.error('Exited with code:', code);
    if (code === 0) return;
    fs.watchFile(args[0], () => {
    fs.unwatchFile(args[0]);
    start(file);
     });
     });
      }

     start.call(null, 'core.ts');
