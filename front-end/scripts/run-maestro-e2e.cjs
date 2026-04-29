const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync, execSync } = require('child_process');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

function findMaestro() {
  if (process.env.MAESTRO_BIN) {
    const p = process.env.MAESTRO_BIN.replace(/^["']|["']$/g, '');
    if (fs.existsSync(p)) {
      return p;
    }
  }
  const home = os.homedir();
  const local = process.env.LOCALAPPDATA || '';
  const drive = process.env.SystemDrive || 'C:';
  const candidates = [
    path.join(drive, 'maestro', 'bin', 'maestro.bat'),
    path.join(drive, 'maestro', 'bin', 'maestro.cmd'),
    path.join(
      local,
      'Programs',
      'Maestro Studio',
      'bin',
      'maestro.bat'
    ),
    path.join(
      local,
      'Programs',
      'Maestro Studio',
      'bin',
      'maestro.cmd'
    ),
    path.join(home, '.maestro', 'bin', 'maestro.bat'),
    path.join(home, '.maestro', 'bin', 'maestro.cmd'),
    path.join(home, '.maestro', 'bin', 'maestro'),
    path.join(local, 'Maestro', 'maestro.exe'),
    path.join(local, 'maestro', 'maestro.exe'),
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) {
      return c;
    }
  }
  const isWin = process.platform === 'win32';
  const which = isWin ? 'where' : 'which';
  const r = spawnSync(which, ['maestro'], {
    encoding: 'utf8',
    shell: isWin,
    windowsHide: true,
  });
  if (r.status === 0 && r.stdout && r.stdout.trim()) {
    return r.stdout.trim().split(/\r?\n/)[0];
  }
  return null;
}

const maestro = findMaestro();
if (!maestro) {
  console.error('');
  console.error(
    'Maestro CLI nao encontrado. O Maestro Studio (Maestro Studio.exe em AppData\\\\Local\\\\Programs)'
  );
  console.error(
    'nao inclui o comando maestro: e preciso instalar o CLI separadamente (Java 17+).'
  );
  console.error('');
  console.error('Opcao A — ZIP oficial (extrair para C:\\\\maestro e usar C:\\\\maestro\\\\bin):');
  console.error(
    'https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip'
  );
  console.error('Guia: https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli');
  console.error('');
  console.error('Opcao B — Caminho manual em front-end/.env:');
  console.error('MAESTRO_BIN=C:\\\\maestro\\\\bin\\\\maestro.bat');
  console.error('');
  process.exit(1);
}

const flow = path.join(root, 'e2e', 'notas_sos_journey.yaml');

function quoteWinCmd(p) {
  const s = String(p);
  return `"${s.replace(/"/g, '""')}"`;
}

function runMaestro(maestroBin, flowPath) {
  if (process.platform !== 'win32') {
    return spawnSync(maestroBin, ['test', flowPath], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
  }
  const line = `${quoteWinCmd(maestroBin)} test ${quoteWinCmd(flowPath)}`;
  try {
    execSync(line, {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
      windowsHide: true,
      shell: true,
    });
    return { status: 0 };
  } catch (err) {
    const code =
      err && typeof err.status === 'number' ? err.status : 1;
    return { status: code };
  }
}

const result = runMaestro(maestro, flow);

process.exit(result.status === null ? 1 : result.status);
