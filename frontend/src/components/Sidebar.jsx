// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Sidebar.module.css';

const Sidebar = () => {
    const role = localStorage.getItem('role');

    return (
        <div className={styles.sidebar}>
            <ul>
                {role === 'admin' && (
                    <>
                        <li>
                            <NavLink exact to="/admin-dashboard" activeClassName={styles.activeLink}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/manage-users" activeClassName={styles.activeLink}>
                                Manage Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/giftshop-admin" activeClassName={styles.activeLink}>
                                Manage Products
                            </NavLink>
                        </li>
                        {/* Add more admin links as needed */}
                    </>
                )}
                <li>
                    <NavLink to="/profile" activeClassName={styles.activeLink}>
                        Profile
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
