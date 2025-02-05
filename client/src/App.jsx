import './App.css';
import Weather from './components/Weather';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Lookup</h1>
        <p>Use your current location or enter a ZIP code to get current weather conditions</p>
      </header>
      <main>
        <Weather />
      </main>
    </div>
  );
}

export default App;
