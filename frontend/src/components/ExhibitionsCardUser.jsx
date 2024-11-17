import React from 'react';
import styles from '../css/ExhibitionsCardUser.module.css';

const ExhibitionsCardUser = ({ exhibition, onExploreClick }) => {
  // Format the end_date
  const formattedDate = new Date(exhibition.end_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div onClick={() => onExploreClick(exhibition)} className={styles.exhibition_user_card}>
      <img src={exhibition.image} alt={exhibition.name_} className={styles.exhibition_image} />
      <div className={styles.exhibition_text}>
        <h2 className={styles.exhibition_title}>{exhibition.name_}</h2>
        <p className={styles.exhibition_date}>Through {formattedDate}</p>
      </div>
    </div>
  );
};

// Modal to show more details about the selected exhibition
const ExhibitionModalUser = ({ exhibition, onClose }) => {
  // Format start_date and end_date
  const formattedStartDate = new Date(exhibition.start_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = new Date(exhibition.end_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close_button} onClick={onClose}>&times;</span>
        <img src={exhibition.image} alt={exhibition.name_} className={styles.image}/>
        <h2>{exhibition.name}</h2>
        <p>
          <strong>Start Date:</strong> {formattedStartDate}
        </p>
        <p>
          <strong>End Date:</strong> {formattedEndDate}
        </p>
        <p>{exhibition.description_}</p>
      </div>
    </div>
  );
};


const EventCardUser = ({ event, onExploreClick }) => {
  // Format the end_date
  const formattedDate = new Date(event.date_end).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div onClick={() => onExploreClick(event)} className={styles.exhibition_user_card}>
      <div className={styles.exhibition_text}>
        <h2 className={styles.exhibition_title}>{event.name}</h2>
        <p className={styles.exhibition_date}>Through {formattedDate}</p>
      </div>
    </div>
  );
};

// Modal to show more details about the selected exhibition
const EventModalUser = ({ event, onClose }) => {
  // Format start_date and end_date
  const formattedStartDate = new Date(event.date_start).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = new Date(event.date_end).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close_button} onClick={onClose}>&times;</span>
        <h2>{event.name}</h2>
        <p>
          <strong>Start Date:</strong> {formattedStartDate}
        </p>
        <p>
          <strong>End Date:</strong> {formattedEndDate}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
      </div>
    </div>
  );
};

export { ExhibitionsCardUser, ExhibitionModalUser, EventCardUser, EventModalUser };
