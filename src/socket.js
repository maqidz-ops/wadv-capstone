const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = function setupSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Token tidak disertakan"));
      }

      const payload = jwt.verify(
        token,
        config.jwtAccessSecret
      );

      socket.data.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (err) {
      next(
        new Error(
          "Token tidak valid: " + err.message
        )
      );
    }
  });

  io.on("connection", (socket) => {
    const { userId, email } = socket.data.user;

    console.log(
      `[Socket] User ${email} (${userId}) terhubung`
    );

    socket.join(`user:${userId}`);
    socket.join("tasks:global");

    io.emit("users:online", {
      count: io.sockets.sockets.size,
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[Socket] User ${email} terputus - ${reason}`
      );

      io.emit("users:online", {
        count: io.sockets.sockets.size,
      });
    });

    socket.on("ping", (cb) => {
      if (typeof cb === "function") {
        cb("pong");
      }
    });
  });
};