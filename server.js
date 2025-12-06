const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

const storageConfid = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) + '-' + Date.now();
    }
})

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
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
        console.log('false', e);
    }
}

const FilesData = sequelize.define('FileData',
    {
        name: { type: DataTypes.STRING, allowNull: false }
    }
)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dir', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) return res.status(404).send('Ошибка');

        let list = [];

        files.forEach(file => {
            const fileUrl = `/uploads/${file}`;
            list.push({ name: file, url: fileUrl });
        });

        console.log(list);

        res.json({ files: list });
    });
});

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
});

app.listen(3000, async () => {
    await asdas();
    console.log('http://localhost:3000')
});