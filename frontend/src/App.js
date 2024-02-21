import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Navbar from './Components/Navbar';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
