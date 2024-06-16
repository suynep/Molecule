const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const { execFile } = require("child_process");
const fs = require("fs");
const cors = require("cors");

// const parseTmTheme = require("monaco-themes").parseTmTheme;
// const nordTheme = require("monaco-themes/themes/Nord.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const compileCacheDir = "./cache"
const fileExtMap = {
	"python": ".py",
	"javascript": ".js",
	"c": ".c"
}


if (!fs.existsSync(compileCacheDir)) {
	// If it doesn't exist, create the directory
	fs.mkdirSync(compileCacheDir);

	console.log(`Directory '${compileCacheDir}' created.`);
}

const port = 5555;

app.use(express.json());
app.use(cors());

io.on('connection', (socket) => { console.log("user connected"); });


// app.get('/someEndPoint', (req, res) => {
// 	var data = {
// 		"message": "Hello, World!"
// 	};
// 	res.send(res.json(data))
// });

app.post('/someEndPoint', (req, res) => {
	// console.log(req.body.message);
	// console.log(req.body.language);
	let errMsg = "";
	let stdErrMsg = "";
	if (req.body.language === "python") {
		let fileName = "main.py"
		fs.writeFileSync(`${compileCacheDir}/${fileName}`, req.body.message);
		exec(`python3 ${compileCacheDir}/${fileName}`, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				errMsg = error.message;
				// return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				stdErrMsg = stderr;
				// return;
			}
			res.send({ message: stdout, error: errMsg, stderr: stdErrMsg });

		});
	}
	if (req.body.language === "javascript") {
		let fileName = "main.js"
		fs.writeFileSync(`${compileCacheDir}/${fileName}`, req.body.message);
		exec(`node ${compileCacheDir}/${fileName}`, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				errMsg = error.message;
				// return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				stdErrMsg = stderr;
				// return;
			}
			res.send({ message: stdout, error: errMsg, stderr: stdErrMsg });

		});
	}
	if (req.body.language == "c") {
		let fileName = "main.c"
		fs.writeFileSync(`${compileCacheDir}/${fileName}`, req.body.message);
		exec(`gcc -o ${compileCacheDir}/main ${compileCacheDir}/${fileName}`, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				errMsg = error.message;
				// return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				stdErrMsg = stderr;
				// return;
			}
		});
		execFile(`${compileCacheDir}/main`, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				// return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				// return;
			}
			res.send({ message: stdout });
		})
	}

});

server.listen(port, () => { console.log(`Server is running on port ${port}`); });
