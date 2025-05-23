const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { family, MUSL } = require('detect-libc');
const pack = require('../package.json');
const { spawn } = require('child_process');

const { name, version, repository } = pack;

const DOWNLOAD_URL = `${repository.replace(/\.git$/, '')}/releases/download/${version}`;

const versions = {
  'aarch64-unknown-linux-musl': 'ARM64 Linux with musl 1.2.3',
  'x86_64-unknown-linux-musl': '64-bit Linux with musl 1.2.3',
  'x86_64-unknown-linux-gnu': '64-bit Linux (kernel 3.2+, glibc 2.17+)',
};

const arch = os.arch();
const platform = os.platform();

/**
 * @param {{osFamily: string | null}} param0
 * @returns
 */
async function getArchitecture({ osFamily }) {
  if (platform === 'linux') {
    if (osFamily !== MUSL) {
      if (arch === 'x64') {
        return 'x86_64-unknown-linux-gnu';
      }
      return null;
    }

    if (arch === 'arm64') {
      return 'aarch64-unknown-linux-musl';
    } else if (arch === 'x64') {
      return 'x86_64-unknown-linux-musl';
    }
  }
  return null;
}

/**
 *
 * @param {string} url
 * @param {string} dest
 */
async function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);

  return new Promise((resolve) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          if (!redirectUrl) {
            console.error('Redirect url is', redirectUrl);
            resolve(1);
            return;
          }
          console.log(`Redirecting to: ${redirectUrl}`);
          downloadFile(redirectUrl, dest).then((d) => {
            resolve(d);
          });
          return;
        }

        if (response.statusCode !== 200) {
          console.error(`Failed to get '${url}' (${response.statusCode})`);
          fs.unlink(dest, () => {});
          resolve(1);
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${dest}`);
          resolve(0);
        });

        file.on('error', (err) => {
          fs.unlink(dest, () => {});
          console.error(`Error writing to file: ${err.message}`);
          resolve(1);
        });
      })
      .on('error', (err) => {
        console.error(`Error downloading file: ${err.message}`);
      });
  });
}

(async () => {
  const osFamily = await family();
  const architecture = await getArchitecture({ osFamily });

  /**
   * @type {string | null}
   */
  let fileArch = null;
  switch (architecture) {
    case 'aarch64-unknown-linux-musl':
      fileArch = 'linux-arm64-musl';
      break;
    case 'x86_64-unknown-linux-gnu':
      fileArch = 'linux-x64-gnu';
      break;
    case 'x86_64-unknown-linux-musl':
      fileArch = 'linux-x64-musl';
      break;
    default:
      console.warn('Default case of arch', { fileArch, architecture });
  }

  if (fileArch && architecture && versions[architecture]) {
    const filename = `${name}.${fileArch}.node`;
    const filePath = path.join(__dirname, '..', filename);

    const fileUrl = `${DOWNLOAD_URL}/${filename}`;
    console.log(`Binary exists '${name}'.Downloading ${fileUrl} to ${filePath}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const code = await downloadFile(fileUrl, filePath);
    console.log('Download end with code', code);
    process.exit(code);
  } else {
    console.info('Binary file not found, try to build', { name, arch, platform, osFamily });
    const build = spawn('npm', ['run', 'build']);

    build.on('error', (err) => {
      console.error(`Failed to build '${name}'`, err);
    });

    build.stderr.on('data', (d) => {
      console.log(d.toString());
    });

    build.stdout.on('data', (d) => {
      console.log(d.toString());
    });

    build.on('close', (code) => {
      console.info(`Build '${name}' end with code`, code);
      process.exit(code);
    });
  }
})();
