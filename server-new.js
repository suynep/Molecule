const express = require('express');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getOSInfo(callback) {
  const platform = os.platform();
  const release = os.release();
  let osInfo = '';

  if (platform === 'win32') {
    osInfo = `Windows ${release}`;
    callback(null, osInfo);
  } else if (platform === 'linux') {
    exec('lsb_release -d', (err, stdout, stderr) => {
      if (err) {
        callback(`Error detecting Linux distro: ${stderr}`, null);
        return;
      }
      osInfo = stdout.split(':')[1].trim();
      callback(null, osInfo);
    });
  } else {
    callback(`Unsupported OS: ${platform}`, null);
  }
}

function checkCompiler(compiler, checkCmd, callback) {
  exec(checkCmd, (err, stdout, stderr) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

app.get('/osinfo', (req, res) => {
  getOSInfo((err, osInfo) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ osInfo });
    }
  });
});

app.post('/checkCompilers', (req, res) => {
  const compilers = {
    python: 'python --version',
    gcc: 'gcc --version',
    node: 'node --version'
  };

  let results = {};
  let completed = 0;

  Object.keys(compilers).forEach(compiler => {
    checkCompiler(compiler, compilers[compiler], (installed) => {
      results[compiler] = installed;
      completed++;
      if (completed === Object.keys(compilers).length) {
        res.json(results);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
