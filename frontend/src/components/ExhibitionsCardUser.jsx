import React from 'react';
import '../css/ExhibitionsCardUser.css';

const ExhibitionsCardUser = ({ exhibition, onExploreClick }) => {
  return (
    <div onClick={() => onExploreClick(exhibition)} className="exhibition-user-card">
      <img src={exhibition.image} alt={exhibition.name} className="exhibition-image" />
      <div className="exhibition-text">
        <h2 className="exhibition-title">{exhibition.name}</h2>
        <p className="exhibition-date">Through {exhibition.date_end}</p>
      </div>
    </div>
  );
};

// Modal to show more details about the selected exhibition
const ExhibitionModalUser = ({ exhibition, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={exhibition.image} alt={exhibition.name} />
        <h2>{exhibition.name}</h2>
        <p><strong>Start Date:</strong> {exhibition.date_start}</p>
        <p><strong>End Date:</strong> {exhibition.date_end}</p>
        <p><strong>Description:</strong> {exhibition.description}</p>
      </div>
    </div>
  );
};

export { ExhibitionsCardUser, ExhibitionModalUser };
