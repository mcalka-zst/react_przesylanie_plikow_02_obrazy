import { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    // tablica e.target.files jest dostępna w zdarzeniu zmiany (change event) dla elementu <input type="file">
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png') && selectedFile.size <= 1 * 1024 * 1024) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null); 
      setError('Nieprawidłowy plik. Dozwolone są tylko pliki JPEG i PNG do 1MB.');
      setMessage(null);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    //Wysyłanie pliku
    if(!file){
      setError("Wybierz plik z obrazem JPEG lub PNG do 1MB!!!");
      setMessage(null);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try{
      const response = await fetch("http://localhost:3001/upload", {
        method:'POST',
        body:formData
      });
      if(!response.ok){
        throw new Error("Błąd podczas przesyłania pliku");
      }
      const res = await response.json();
      
      // setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Resetuj pole pliku
        setMessage(null);
      }
      if(res.message) setMessage(res.message);
      if(res.error) setError(res.error);
    }
    catch (err){
      console.error('Błąd: ', err)
    }
  };

  return (
    <main>
      <h1>Wyślij jakiś obrazek</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} ref={fileInputRef}  />
        <br />
        {error && <p className="error">{error}</p>}
        <br />
        <button type="submit">Wyślij obraz</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
};

export default App;
