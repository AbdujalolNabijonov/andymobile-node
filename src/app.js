const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router_bssr = require("./routers/router_bssr");
const router_bssp = require("./routers/router_bssp");
const jwt = require("jsonwebtoken");
const { MORGAN_FOMAT, VISIBLE_MSG } = require("./libs/config");
const cors = require("cors");
const express_session = require("express-session");
const path = require("path");
const MongoDb_store = require("connect-mongodb-session")(express_session);

const store = new MongoDb_store({
  uri: process.env.MONGODB_URL,
  collection: "Session",
});

//middlewares
// app.use(morgan("tiny"));
app.use(express.static("./public"));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FOMAT));

//sessions
app.use(
  express_session({
    secret: process.env.SECRET_COOKIE,
    store: store,
    cookie: {
      maxAge: 60 * 1000 * 30,
    },
    resave: true,
    saveUninitialized: true,
  })
);

//Permission to outside APIs
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

//view engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

//router
app.use("/admin", router_bssr);
app.use("/", router_bssp);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});
//SOCKET IO
const socketClients = new Map();
const clinetsMessages = [];
let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;

  const token = socket.handshake.headers?.cookie
    ?.split("; ")
    ?.find((cookie) => cookie.startsWith("access_token="))
    ?.split("=")[1];

  if (token) {
    const member = jwt.verify(token, process.env.SECRET_TOKEN);
    console.log(`=== SOCKET CONNECTION & ${member.memberNick} ===`);
    socketClients.set(socket, member);
    const onlineMembersPayload = {
      event: "getMembers",
      membersData: Array.from(socketClients.values()),
    };
    const newClientPayload = {
      event: "info",
      totalClients: onlineUsers,
      memberData: member,
      action: "joined",
    };

    if (clinetsMessages.length > VISIBLE_MSG)
      clinetsMessages.split(0, clinetsMessages.length - VISIBLE_MSG);
    const getMessagesPayload = {
      event: "getMessages",
      messages: clinetsMessages,
    };
    socket.emit("getMessages", JSON.stringify(getMessagesPayload));
    io.emit("onlineUsers", {
      onlinePeople: JSON.stringify(onlineMembersPayload),
    });
    io.emit("info", JSON.stringify(newClientPayload));
  }

  socket.on("message", async (data) => {
    const { text } = JSON.parse(data);
    const messagePayload = {
      event: "message",
      text,
      memberData: socketClients.get(socket),
    };
    clinetsMessages.push(messagePayload);

    const getMessagesPayload = {
      event: "getMessages",
      messages: clinetsMessages,
    };
    io.emit("getMessages", JSON.stringify(getMessagesPayload));
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    const infoMessagePayload = {
      event: "info",
      onlineUsers,
      member: socketClients.get(socket),
      action: "left",
    };
    socket.broadcast.emit("info", JSON.stringify(infoMessagePayload));
  });
});

module.exports = server;
