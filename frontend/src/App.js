import React from 'react'; // Required for JSX syntax
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import './App.css'; // Your custom styles (optional)


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1 className="text-primary">Welcome to Salsa Events!</h1>
          <p className="lead">This is styled using Bootstrap.</p>
          <button className="btn btn-success">Click Me</button>
        </div>
      </header>
    </div>
  );
}

export default App;

