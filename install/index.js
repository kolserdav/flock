const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { family, MUSL } = require('detect-libc');
const pack = require('../package.json');
const { spawn } = require('child_process');

const { name, version, repository } = pack;

const DOWNLOAD_URL = `${repository.replace(/\.git$/, '')}/releases/download/${version}/${name}`;

const versions = {
  'aarch64-unknown-linux-musl': 'ARM64 Linux with musl 1.2.3',
  'x86_64-unknown-linux-musl': '64-bit Linux with musl 1.2.3',
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

(async () => {
  const osFamily = await family();
  const architecture = await getArchitecture({ osFamily });

  if (architecture && versions[architecture]) {
    const filePath = path.join(__dirname, '..', 'flock-rs.node');

    const fileUrl = `${DOWNLOAD_URL}.${architecture}.node`;
    console.log(`Binary exists '${name}'.Downloading ${fileUrl} to ${filePath}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const file = fs.createWriteStream(filePath);
    https
      .get(fileUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${filePath}`);
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {});
        console.error(`Error downloading file: ${err.message}`);
      });
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
