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
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
		credentials: true
	}
});
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

io.on('connection', (socket) => {
	console.log("user connected");

	socket.on('searchDocs', (searchQuery, language) => {
		console.log("searchDocs event received");
		console.log(searchQuery);
		console.log(language);

		parseSearchQuery(searchQuery, language);
	});

	socket.on('joinRoom', (roomId) => {
		socket.join(roomId);
		console.log(`User joined room ${roomId}`);
		socket.to(roomId).emit('userJoined', socket.id);
	});

	socket.on('changedEditorValue', (editorValue, roomId) => {
		socket.to(roomId).emit('changedEditorValue', editorValue);
		console.log("changedEditorValue event received");
		console.log(io.sockets.adapter.rooms);
	});

	socket.on('sendChat', (message, username, roomId) => {
		socket.to(roomId).emit('receive', { message: message, name: username });
	});

	socket.on('join-chat', (roomId, username) => {
		socket.join(roomId);
		socket.to(roomId).emit('user-joined', username);
		console.log(io.sockets.adapter.rooms);
	});

	socket.on('left-chat', (username, roomId) => {
		socket.to(roomId).emit('left', username);
	});
});


function parseSearchQuery(searchQuery, language) {

	if (language == 'python') {
		exec(`python3 -m pydoc ${searchQuery}`, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				// return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				// return;
			}
			io.emit('searchDocs', stdout);

		});
	}
}

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
