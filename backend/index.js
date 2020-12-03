const express = require("express");
const connect = require("./config/db");
const cors = require("cors");

//crear el servidor
const app = express();
//conectar la base de datos
connect();

//habilitar cors
app.use(cors());
//habilitar express.json
app.use(express.json({ extended: true }));

//puerto de la app
const PORT = process.env.PORT || 4000;
//importar las rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

//arancar el server
app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}`);
});
