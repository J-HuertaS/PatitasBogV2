import React, { useState, useEffect } from 'react'; // Importamos useState y useEffect
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; 
import LeftContainer from './LeftContainer';
import MainContainer from './MainContainer';
import RightContainer from './RightContainer';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const [showLeftContainer, setShowLeftContainer] = useState(true);

    useEffect(() => {
        if(location.pathname=='/' || location.pathname=='/login' || location.pathname=='/register'
           || location.pathname=='/recover_password_request'
            || location.pathname=='/change_password'){
            setShowLeftContainer(false);
        }
        else{
            setShowLeftContainer(true);
        }
    }, [location.pathname]);

    return (
        <div className='view'>
            <Navbar />
            <div className="main-content-wrapper">
                {showLeftContainer && (
                    <LeftContainer>
                    </LeftContainer>
                )}
                <MainContainer>
                    {children}
                </MainContainer>
                <RightContainer>
                </RightContainer>
            </div>
        </div>
    );
};

export default Layout;