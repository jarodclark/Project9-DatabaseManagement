import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Intro from './Intro.js';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter, Routes} from 'react-router-dom';


function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Intro/>}/>
                <Route path = "/Intro" element={<Intro/>}/>
                <Route path = "/Intro/App" element={<App/>}/>
            </Routes>
        </BrowserRouter>
    )
}
ReactDOM.render(
  <React.StrictMode>
    <Router/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
