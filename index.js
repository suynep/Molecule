// module.exports = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>OS Checker</title>
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
//   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       margin: 0;
//       padding: 0;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       height: 100vh;
//       background-color: #f0f2f5;
//     }

//     #getOSButton {
//       background-color: #007bff;
//       color: white;
//       border: none;
//       padding: 15px 30px;
//       font-size: 16px;
//       border-radius: 5px;
//       cursor: pointer;
//       transition: background-color 0.3s ease;
//       display: flex;
//       align-items: center;
//     }

//     #getOSButton i {
//       margin-right: 10px;
//     }

//     #getOSButton:hover {
//       background-color: #0056b3;
//     }

//     #output {
//       margin-top: 20px;
//       padding: 20px;
//       background-color: white;
//       border-radius: 5px;
//       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//       width: 80%;
//       max-width: 600px;
//       text-align: left;
//     }

//     .compiler-status {
//       margin: 10px 0;
//       padding: 10px;
//       border-radius: 3px;
//     }

//     .installed {
//       background-color: #d4edda;
//       color: #155724;
//     }

//     .missing {
//       background-color: #f8d7da;
//       color: #721c24;
//     }
//   </style>
// </head>
// <body>
//   <button id="getOSButton">
//     <i class="fas fa-desktop"></i> Get OS Details
//   </button>
//   <div id="output"></div>

//   <script>
//     document.getElementById('getOSButton').addEventListener('click', () => {
//       axios.get('/osinfo')
//         .then(response => {
//           const osInfo = response.data.osInfo;
//           document.getElementById('output').innerHTML = `<p>Operating System: <strong>${osInfo}</strong></p>`;
//           checkCompilers(osInfo);
//         })
//         .catch(error => {
//           console.error('Error fetching OS info:', error);
//         });
//     });

//     function checkCompilers(osInfo) {
//       axios.post('/checkCompilers')
//         .then(response => {
//           const compilers = response.data;
//           let message = '';
//           for (const [compiler, installed] of Object.entries(compilers)) {
//             if (!installed) {
//               message += `<div class="compiler-status missing">${compiler} is not installed.<br>`;
//               message += `${getInstallInstructions(osInfo, compiler)}</div>`;
//             } else {
//               message += `<div class="compiler-status installed">${compiler} is installed.</div>`;
//             }
//           }
//           document.getElementById('output').innerHTML += message;
//         })
//         .catch(error => {
//           console.error('Error checking compilers:', error);
//         });
//     }

//     function getInstallInstructions(osInfo, compiler) {
//       if (osInfo.includes('Windows')) {
//         if (compiler === 'python') return 'Download and install Python from <a href="https://www.python.org/downloads/" target="_blank">https://www.python.org/downloads/</a>';
//         if (compiler === 'gcc') return 'Install MinGW from <a href="https://sourceforge.net/projects/mingw/" target="_blank">https://sourceforge.net/projects/mingw/</a>';
//         if (compiler === 'node') return 'Download and install Node.js from <a href="https://nodejs.org/" target="_blank">https://nodejs.org/</a>';
//       } else if (osInfo.includes('Ubuntu')) {
//         if (compiler === 'python') return 'Run "sudo apt-get install python3"';
//         if (compiler === 'gcc') return 'Run "sudo apt-get install gcc"';
//         if (compiler === 'node') return 'Run "sudo apt-get install nodejs"';
//       }
//       return 'Installation instructions not available.';
//     }
//   </script>
// </body>
// </html>`;
