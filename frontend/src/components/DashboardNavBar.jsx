import React from 'react'

const DashboardNavBar = () => {
    return (
        <div>
            <a href="/StaffDashboard">Staff Dashboard</a>
            <h2>Event Cordinator</h2>
            <ul className="nav2-links">
                <li><a href="/EventDirectorDash">Events</a></li>
                <li><a href="/event-report">Event Reports</a></li>
            </ul>
            <h2>Art Curator</h2>
            <ul className="nav2-links">
                <li><a href="/curate-art">Artwork</a></li>
                <li><a href="/curate-exhibitions">Exhibitions</a></li>
            </ul>
            <h2>Shop Staff</h2>
            <ul className="nav2-links">
                <li><a href="/MFAShopStaff">Shop</a></li>
                <li><a href="/shop-report">Shop Reports</a></li>
            </ul>
            {/* logout button */}
            <button>Logout</button>
        </div>
    )
}

export default DashboardNavBar
