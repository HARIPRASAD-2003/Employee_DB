import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Navbar from './Components/Navbar';
import Login from './pages/login';
import SignUp from './pages/signup';
import Report from './pages/Report';
import ViewReport from './pages/ViewReport';
import Welcome from './pages/Welcome';
import Tasks from './pages/Tasks';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Welcome}/>
        <Route path="/admin" Component={Home}/>
        <Route path="/login" Component={Login}/>
        <Route path="/signup" Component={SignUp}/>
        <Route path="/add_report" Component={Report}/>
        <Route path="/view_report" Component={ViewReport}/>
        <Route path="/tasks" Component={Tasks}/>
      </Routes>
    </Router>
  );
}

export default App;
