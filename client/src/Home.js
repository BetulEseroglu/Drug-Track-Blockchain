import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

function Home() {
    const history = useHistory();
    const [darkMode, setDarkMode] = useState(false);

    const redirect_to_roles = () => {
        history.push('/roles');
    };

    const redirect_to_addmed = () => {
        history.push('/addmed');
    };

    const redirect_to_supply = () => {
        history.push('/supply');
    };

    const redirect_to_track = () => {
        history.push('/track');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={darkMode ? 'dark-mode' : 'light-mode'} style={styles.container}>
            <style>
                {`
                    body {
                        background-color: #FF5B22;
                        color: var(--text-color);
                        font-family: Arial, sans-serif;
                        transition: background-color 0.3s, color 0.3s;
                    }
    
                    button {
                        margin: 5px 0;
                        padding: 5px 10px;
                        font-size: 14px;
                        border-radius: 5px;
                        cursor: pointer;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        transition: background-color 0.3s, box-shadow 0.3s;
                    }
    
                    .light-mode {
                        --background-color: #f5f5f5;
                        --text-color: #333333;
                        --button-background: #007bff;
                        --button-text: #ffffff;
                        --header-background: #ffffff;
                        --footer-background: #f1f1f1;
                    }
    
                    .dark-mode {
                        --background-color: #333333;
                        --text-color: #f5f5f5;
                        --button-background: #17a2b8;
                        --button-text: #ffffff;
                        --header-background: #444444;
                        --footer-background: #3a3a3a;
                    }
    
                    .btn {
                        background-color: #102C57;
                        color: var(--button-text);
                        border: none;
                    }
    
                    .btn:hover {
                        opacity: 0.8;
                        box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
                    }
    
                    .header, .footer {
                        text-align: center;
                        padding: 20px;
                        background-color: var(--header-background);
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, border-radius 0.3s;
                    }
    
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
    
    
                    .content {
                        background-color: var(--header-background);
                        padding: 10px;
                        border-radius: 8px;
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                        margin-bottom: 20px;
                    }
    
                    .section {
                        margin-bottom: 30px;
                    }
    
                    .card {
                        background-color: #e0e0e0; /* Açık gri renk */
                        border: none;
                        border-radius: 8px;
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        margin-bottom: 20px;
                    }
    
                    h3, h5, h6 {
                        margin: 10px 0;
                    }
    
                    hr {
                        border: 0;
                        border-top: 1px solid var(--text-color);
                        margin: 20px 0;
                    }
    
                    .container {
                        display: flex;
                    }
    
                    .main-content {
                        flex: 1;
                    }
    
                    .image-container {
                        flex: 0 0 300px; /* Görselin genişliği */
                        padding-left: 20px;
                    }
    
                    .image-container img {
                        max-width: 100%;
                        height: auto;
                    }
                `}
            </style>
            <header className="header">
                Drug Track System
            </header>
            <div className="container">
                <div className="main-content">
                    <div className="content">
                        <button onClick={toggleDarkMode} className="btn mb-4">
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <h3>Medicine Supply Chain Flow</h3>
                        <div className="card">
                            <h5><b>Step 1:</b> Register Raw Material Suppliers, Manufacturers, Distributors, and Pharmacies</h5>
                            <button onClick={redirect_to_roles} className="btn">Register</button>
                        </div>
                        <div className="card">
                            <h5><b>Step 2:</b> Order Medicines</h5>
                            <button onClick={redirect_to_addmed} className="btn">Order Medicines</button>
                        </div>
                        <div className="card">
                            <h5><b>Step 3:</b> Control Supply Chain</h5>
                            <button onClick={redirect_to_supply} className="btn">Control Supply Chain</button>
                        </div>
                        <div className="card">
                            <h5><b>Track</b> the medicines:</h5>
                            <button onClick={redirect_to_track} className="btn">Track Medicines</button>
                        </div>
                    </div>
                </div>
                
            </div>
            <footer className="footer">
                &copy; 2024 Drug Track System
                       Developed by Furkan T. İlkay T. Betül E. Enes K.
            </footer>
        </div>
    );
}    
const styles = {
    container: {
        padding: '20px'
    }
};

export default Home;