const os = require('os');

const versions = {
  'aarch64-apple-darwin': 'ARM64 macOS (11.0+, Big Sur+)',
  'aarch64-unknown-linux-gnu': 'ARM64 Linux (kernel 4.1, glibc 2.17+)',
  'i686-pc-windows-msvc': '32-bit MSVC (Windows 10+, Windows Server 2016+, Pentium 4)',
  'i686-unknown-linux-gnu': '32-bit Linux (kernel 3.2+, glibc 2.17+, Pentium 4)',
  'x86_64-apple-darwin': '64-bit macOS (10.12+, Sierra+)',
  'x86_64-pc-windows-gnu': '64-bit MinGW (Windows 10+, Windows Server 2016+)',
  'x86_64-pc-windows-msvc': '64-bit MSVC (Windows 10+, Windows Server 2016+)',
  'x86_64-unknown-linux-gnu': '64-bit Linux (kernel 3.2+, glibc 2.17+)',
};

function getArchitecture() {
  const arch = os.arch();
  const platform = os.platform();

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin';
  } else if (platform === 'linux') {
    if (arch === 'arm64') {
      return 'aarch64-unknown-linux-gnu';
    } else if (arch === 'ia32') {
      return 'i686-unknown-linux-gnu';
    } else {
      return 'x86_64-unknown-linux-gnu';
    }
  } else if (platform === 'win32') {
    if (arch === 'x64') {
      if (process.env.hasOwnProperty('GCC_VERSION')) {
        return 'x86_64-pc-windows-gnu';
      } else {
        return 'x86_64-pc-windows-msvc';
      }
    } else {
      return 'i686-pc-windows-msvc';
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
