import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PopUpMessages.css';

const Success = ({title, end, redirect}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (redirect) {
                 navigate(redirect); // <--- cambie de navigate(`/${redirect}`); 
            }
        }, 1000); 
        return () => clearTimeout(timer);
    }, [redirect, navigate]);

    return(
        <div className='background-block'>
            <div className='success-popup'>
                <h1>{title}</h1>
                <h2>{end}...</h2> {/*texto de popup */}
            </div>
        </div>
    )
}

export default Success;