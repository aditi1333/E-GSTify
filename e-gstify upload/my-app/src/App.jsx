import React from 'react';
import TaxGenie from './components/TaxGenie';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>E-GSTify</h1>
      </header>
      <main>
        <TaxGenie />
      </main>
    </div>
  );
}

export default App;