const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path')
const handlebars = require('express-handlebars');
const sessionRouter = require('./routes/sessions.router');
const app = express();
const PORT = 8080

app.listen(PORT, () => {
    console.log(`Servidor is running on port ${PORT}`);
})

//Conexión con mongo Atlas
mongoose.connect("mongodb+srv://francogaray4:fg_dbUser_84@cluster0.9vspn3d.mongodb.net/quintoDesafioEntregable?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Persistir información de sesiones en una db.
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://francogaray4:fg_dbUser_84@cluster0.9vspn3d.mongodb.net/quintoDesafioEntregable?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 1000
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialize: false
}))

//Config Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "handlebars")

//Middleware para procesar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Paths
app.use("/", sessionRouter)