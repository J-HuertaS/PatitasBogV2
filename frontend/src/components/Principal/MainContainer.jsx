import React from 'react';
import '../../styles/MainContainer.css';

const MainContainer = ({ children }) => {
    return (
        <div className="main-container">
            {children}
        </div>
    );
};

export default MainContainer;