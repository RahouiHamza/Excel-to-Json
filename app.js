const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetNameList = workbook.SheetNames;
        let sheetsData = {};

        sheetNameList.forEach(sheetName => {
            sheetsData[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        });

        res.json(sheetsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to convert the Excel file.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
