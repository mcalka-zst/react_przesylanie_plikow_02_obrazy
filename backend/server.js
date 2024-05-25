const express = require('express');
const cors = require('cors');
const multer = require('multer'); // biblioteka multer ułatwia przetwarzanie plików przesyłanych przez formularze HTTP
const app = express();
const port = 3001;

app.use(cors());

// konfiguracja multera, aby zapisywał przesłane pliki w folderze uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// funkcja fileFilter do sprawdzania typu pliku
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Nieprawidłowy typ pliku. Dozwolone są tylko pliki JPG i PNG.'), false);
  }
};

// konfiguracja multer z limitem rozmiaru i filtrem typu pliku
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // limit rozmiaru pliku 1MB w bajtach
  },
  fileFilter: fileFilter
});

//------------------------------------------------
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nieprawidłowy plik. Dozwolone są tylko pliki JPG i PNG do 1MB.' });
  }
  console.log('Przesłano ', req.file);
  res.json({ message: 'Plik został przesłany pomyślnie!'});
});

//-------------------------------------------------
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
  } else if (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});