import React from 'react';
import HomeNavBar from '../components/HomeNavBar';
import backgroundImage from '../assets/visitbackground.jpg';
import '../css/Visit.css';

const Hero = () => (
  <section className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
    {/* Add content here if necessary */}
  </section>
);

const Header = () => (
   <header className="museum-header">
   </header>
);

const Visit = () => {
  return (
    <div>
      <Header />
      <Hero />
      <div style={{ marginTop: '100px' }}> {/* margin to match the navbar height */}
        <HomeNavBar />
      </div>
      <div className="info-container">
        <Location />
        <Hours />
        <Admission />
      </div>
    </div>
  );
};

const Location = () => (
  <div className="info-box">
    <h2>Location</h2>
    <p>Located in the Houston Museum District of Houston, Texas</p>
    <a href="#map">View Map</a>
    <p>1001 Bissonnet St, Houston, TX 77005</p>
  </div> 
);

const Hours = () => (
  <div className="info-box">
    <h2>Hours</h2>
    <table>
      <tbody>
        <tr><td>Monday</td><td className="closed">Closed</td></tr>
        <tr><td>Tuesday</td><td className="closed">Closed</td></tr>
        <tr><td>Wednesday</td><td>11 a.m. - 5 p.m</td></tr>
        <tr><td>Thursday</td><td>11 a.m. - 9 p.m</td></tr>
        <tr><td>Friday</td><td>11 a.m. - 9 p.m</td></tr>
        <tr><td>Saturday</td><td>11 a.m. - 6 p.m</td></tr>
        <tr><td>Sunday</td><td>12:30 a.m. - 6 p.m</td></tr>
      </tbody>
    </table>
  </div> 
);

const Admission = () => (
  <div className="info-box">
    <h2>Admission</h2>
    <div className="member-admission">
      <h3>MFAH Members</h3>
      <p>Enjoy unlimited free admission on every visit.</p>
      <span className="arrow">→</span>
    </div>
    <table>
      <tbody> 
        <tr>
          <td>Adults <br /><span className="age-info">19+</span></td>
          <td>$24</td>
        </tr>

        <tr>
          <td>Seniors <br /><span className="age-info">65+ with ID</span></td>
          <td>$20</td>
        </tr> 
        
        <tr>
          <td>Youth <br /><span className="age-info">13-18</span></td>
          <td>$20</td>
        </tr>

        <tr>
          <td>Children <br /><span className="age-info">12 & younger</span></td>
          <td className="free">FREE</td>
        </tr> 
        
        <tr>
          <td>Thursday MFAH Permanent Collections</td>
          <td className="free">FREE</td>
        </tr>

        <tr>
          <td>Thursday ALL ACCESS <br /><span className="age-info">13+</span></td>
          <td>$10</td>
        </tr>
      </tbody>
    </table>
    <button className="get-tickets">Get Tickets</button>
  </div>
);

export default Visit;