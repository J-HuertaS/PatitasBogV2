import React, { useEffect } from 'react';
import '../../styles/PopUpMessages.css';

const Fail = ({setShowFailPopup, title, body}) => {
    const handleTextClick = () => {
        setShowFailPopup(false);
    };
    
    const errorMessagesArray = body ? body.split('\n') : [];

    return(
        <div className='background-block'>
            <div className='fail-popup'>
                <h1>{title}</h1>
                {errorMessagesArray.length > 0 && (
                    <ul>
                        {errorMessagesArray.map((error, index) => (
                            error.trim() !== '' && <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <span className='fail-span'
                    onClick={handleTextClick}
                >
                    Cerrar
                </span>
            </div>
        </div>
    )
}

export default Fail;