const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

const storageConfid = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname + ':' + new Date().getUTCDay());
    }
})

app.use(express.static('public'));
app.use(multer({ dest: "uploads", storage: storageConfid }).single('filedata'));
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const asdas = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        console.log('true');
    } catch (e) {
        conso
        le.log('false', e);
    }
}

const FilesData = sequelize.define('FileData',
    {
        name: { type: DataTypes.STRING, allowNull: false }
    }
)

app.post('/upload', async (req, res, next) => {

    let filedata = req.file;
    console.log(filedata);

    const filename = await FilesData.create({
        name: filedata.filename,
    });
    await filename.save();

    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен<button onclick='window.location.href=`/`'>Вернутся</button>");
})

app.get('/', (req, res) => {
    res.send(path.join(__dirname, 'public', 'index.html'));
})

app.listen(3000, async () => {
    asdas();
});