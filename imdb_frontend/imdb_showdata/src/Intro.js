import './App.css';
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";

function Intro() {
    const navigate = useNavigate();

    function changePage() {
        navigate('App');
    }

    useEffect(() => {
        navigate('/Intro');
    }, [navigate])

    return (
        <div className='align'>
            <header className="picture">
                <div style={{color: "white", fontWeight: "Bold"}}>
                    <h2>Welcome To Jarod, Brody, Manas, and Sean's Project 9 Web Application</h2>
                    <br/>
                    <h3>Click Button to Continue</h3>
                    <br/>
                    <button style={{width: '200px', height: '50px', outline: 'black', fontWeight: "Bold"}} onClick={changePage}>Helluva Movie Review</button>
                </div>
            </header>
        </div>
    );
}

export default Intro;
