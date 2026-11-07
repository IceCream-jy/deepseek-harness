import net from 'node:net';
import os from 'node:os';
import { spawn } from 'node:child_process';

// Expose the loopback-only Web server on one container interface without
// rewriting HTTP, authentication cookies, Origin headers or WebSocket frames.
const addresses = Object.values(os.networkInterfaces()).flat()
  .filter(row => row.family === 'IPv4' && !row.internal)
  .map(row => row.address);
if (addresses.length !== 1) {
  throw new Error('Expected one container IPv4 address; use the provided bridge network.');
}

const connections = new Set();
const relay = net.createServer(client => {
  const upstream = net.connect({ host: '127.0.0.1', port: 3080 });
  connections.add(client);
  connections.add(upstream);
  const close = () => {
    client.destroy();
    upstream.destroy();
    connections.delete(client);
    connections.delete(upstream);
  };
  client.on('error', close);
  upstream.on('error', close);
  client.on('close', close);
  upstream.on('close', close);
  client.pipe(upstream);
  upstream.pipe(client);
});
relay.maxConnections = 128;

const child = spawn(process.execPath, [
  '--expose-internals',
  '/usr/local/lib/node_modules/@deepseek-ai/dsh/lib/bin.js',
  'web', '--no-open',
], { stdio: 'inherit' });

let stopping = false;
let exitCode = 0;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  exitCode = code;
  relay.close();
  for (const socket of connections) socket.destroy();
  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 8000);
    timer.unref();
  }
}
relay.on('error', error => { console.error(error.message); stop(1); });
child.on('error', error => { console.error(error.message); stop(1); });
child.on('exit', code => {
  stop(code ?? 1);
  process.exitCode = exitCode;
});
process.on('SIGTERM', () => stop());
process.on('SIGINT', () => stop());
relay.listen(3080, addresses[0]);
