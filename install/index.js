const os = require('os');

const versions = {
  'aarch64-unknown-linux-musl': 'ARM64 Linux with musl 1.2.3',
  'x86_64-unknown-linux-musl': '64-bit Linux with musl 1.2.3',
};

function getArchitecture() {
  const arch = os.arch();
  const platform = os.platform();

  if (platform === 'linux') {
    if (arch === 'arm64') {
      return 'aarch64-unknown-linux-musl';
    } else if (arch === 'amd64') {
      return 'x86_64-unknown-linux-musl';
    }
  }
  return null;
}

const architecture = getArchitecture();

if (architecture && versions[architecture]) {
  console.log(`Download version: ${architecture} - ${versions[architecture]}`);
} else {
  console.log('Unknown arch or os');
}
