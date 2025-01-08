const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router_bssr = require("./routers/router_bssr");
const router_bssp = require("./routers/router_bssp");
const jwt = require("jsonwebtoken");
const NotificationModel = require("./schema/notificationSchema");
const memberSchema = require("./schema/memberSchema");
const messageSchema = require("./schema/messageSchema");
const { shapeMongooseObjectId } = require("./libs/convert");
const { MORGAN_FOMAT } = require("./libs/config");
const cors = require("cors");
const express_session = require("express-session");
const MongoDb_store = require("connect-mongodb-session")(express_session);

const store = new MongoDb_store({
  uri: process.env.MONGODB_URL,
  collection: "Session",
});

//middlewares
// app.use(morgan("tiny"));
app.use(express.static("./public"));
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FOMAT))

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
app.set("./views", "./views");
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
const people = {};
let onlineUser = 0;
io.on("connection", (socket) => {
  onlineUser++;
  const token = socket.handshake.headers?.cookie
    ?.split("; ")
    ?.find((cookie) => cookie.startsWith("access_token="))
    ?.split("=")[1];
  if (token) {
    const member = jwt.verify(token, process.env.SECRET_TOKEN);
    console.log("User connected::", member.mb_nick);
    people[member.mb_nick] = socket;
    socket.clientId = member.mb_nick;
    io.emit("onlineUsers", { onlinePeople: Object.keys(people) });
  }

  socket.on("new_msg", async (data) => {
    const { targetClientId, message, sender_image, reply_msg } = data;
    console.log("message written:", message);
    const notification = new NotificationModel({
      notify_sender: member.mb_nick,
      notify_sender_image: sender_image ?? "/icons/default_user.svg",
      notify_reciever: targetClientId,
      notify_context: message,
      notify_reply: reply_msg,
    });
    if (targetClientId) {
      if (people[targetClientId]) {
        people[targetClientId].emit("create_msg", {
          senderClientId: member.mb_nick,
          message,
        });
      }
      await memberSchema.findOneAndUpdate(
        { mb_nick: targetClientId },
        { $inc: { mb_new_messages: 1 } }
      );
      await notification.save();
    } else {
      socket.emit("errorMessage", { text: "Target client not found." });
    }
  });

  io.emit("totalUser", { totalUser: onlineUser });
  socket.on("createMsgApp", async (data) => {
    const mb_id = shapeMongooseObjectId(data.mb_id);
    const msg = new messageSchema({
      mb_id,
      mb_img: data.mb_img,
      msg_sender: data.msg_sender,
      msg_text: data.msg_text,
    });
    await msg.save();
    io.emit("newMsgApp", data);
  });
  socket.on("disconnect", () => {
    onlineUser--;
    socket.broadcast.emit("totalUser", { totalUser: onlineUser })
  });
});

module.exports = server;
