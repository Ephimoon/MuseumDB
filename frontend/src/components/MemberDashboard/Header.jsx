import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { CartContext } from '../CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../../css/MemberDashboard/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    return (
        <div className="header">
            <div className="member-info">
                <span>{firstName} {lastName}</span>
            </div>
            <div className="header-buttons">
                <div className="icon-button" onClick={() => navigate('/')}>
                    <HomeIcon fontSize="large" />
                </div>
                <div className="cart-icon icon-button" onClick={() => navigate('/cart')}>
                    <ShoppingCartIcon fontSize="large" />
                    {cartItems.length > 0 && (
                        <span className="cart-count">{cartItems.length}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
