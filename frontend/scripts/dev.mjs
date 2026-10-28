#!/usr/bin/env node
/**
 * Dev launcher: 启动 vite dev server，把 stdout/stderr 加时间戳前缀
 * 写到 logs/<name>.std.log + 当前 stdout；负责子进程组管理与端口孤儿清理。
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
process.chdir(ROOT);

const IS_WINDOWS = process.platform === 'win32';
const VITE_BIN = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');

const LOG_DIR = process.env.LOG_DIR || 'logs';
const CLIENT_DEV_PORT = process.env.CLIENT_DEV_PORT || '8001';

fs.mkdirSync(LOG_DIR, { recursive: true });

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  );
}

function log(msg) {
  const line = `[${timestamp()}] [dev] ${msg}\n`;
  try { process.stdout.write(line); } catch {}
}

/** 清理端口占用：Unix 用 lsof，Windows 用 netstat + taskkill */
function killOrphansByPort(port) {
  if (IS_WINDOWS) {
    try {
      const out = execSync('netstat -ano -p tcp', {
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString();
      const pids = [
        ...new Set(
          out
            .split('\n')
            .map((line) => line.trim().split(/\s+/))
            .filter(
              (cols) =>
                cols.includes('LISTENING') &&
                cols[1]?.endsWith(`:${port}`) &&
                cols[cols.length - 1],
            )
            .map((cols) => cols[cols.length - 1]),
        ),
      ];
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
          log(`killed orphan pid=${pid} on :${port}`);
        } catch {}
      }
      return pids;
    } catch {
      return [];
    }
  }

  try {
    const out = execSync(`lsof -ti:${port}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (!out) return [];
    const pids = out.split('\n').filter(Boolean);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), 'SIGKILL');
        log(`killed orphan pid=${pid} on :${port}`);
      } catch {}
    }
    return pids;
  } catch {
    return [];
  }
}

/** Windows 需要用 taskkill 结束进程树，Unix 用进程组信号 */
function stopChild(child, signal = 'SIGTERM') {
  if (!child.pid) return;
  if (IS_WINDOWS) {
    try {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' });
    } catch {}
    return;
  }
  try {
    process.kill(-child.pid, signal);
  } catch {}
}

const managed = [];

function startProcess({ name, command, args, logFileName }) {
  const logFd = logFileName
    ? fs.openSync(path.join(LOG_DIR, logFileName), 'a')
    : null;

  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    cwd: ROOT,
    env: process.env,
    detached: !IS_WINDOWS,
  });

  const pipeLines = (stream) => {
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    rl.on('line', (line) => {
      const msg = `[${timestamp()}] [${name}] ${line}\n`;
      try { process.stdout.write(msg); } catch {}
      if (logFd != null) {
        try { fs.writeSync(logFd, msg); } catch {}
      }
    });
  };
  pipeLines(child.stdout);
  pipeLines(child.stderr);

  managed.push({ name, child });
  return child;
}

killOrphansByPort(CLIENT_DEV_PORT);

startProcess({
  name: 'client',
  command: process.execPath,
  args: [VITE_BIN, '--port', CLIENT_DEV_PORT, '--host', '0.0.0.0'],
  logFileName: 'client.std.log',
});

let stopping = false;
function cleanup(signal) {
  if (stopping) return;
  stopping = true;
  log(`cleanup triggered by ${signal}`);

  for (const { child } of managed) {
    stopChild(child, signal || 'SIGTERM');
  }
  setTimeout(() => {
    for (const { child } of managed) {
      stopChild(child, 'SIGKILL');
    }
    killOrphansByPort(CLIENT_DEV_PORT);
    process.exit(0);
  }, 2000);
}

process.on('SIGINT', () => cleanup('SIGTERM'));
process.on('SIGTERM', () => cleanup('SIGTERM'));
// pkill 杀父 npm 后会收 SIGHUP（controlling tty 关闭）；
// Node 默认直接退出不跑 handler，注册 handler 触发 cleanup
process.on('SIGHUP', () => cleanup('SIGTERM'));

Promise.race(
  managed.map(({ child }) => new Promise((r) => child.on('exit', r))),
).then(() => cleanup('SIGTERM'));
