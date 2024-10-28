import React, { useEffect, useState } from 'react';
import '../css/MembershipExpirationAlert.css';



const MembershipExpirationAlert = ({ membershipData }) => {
 const [showAlert, setShowAlert] = useState(false);


 useEffect(() => {
   if (membershipData?.expiration_warning) {
     setShowAlert(true);
   }
 }, [membershipData]);


 if (!showAlert) return null;


 const formatDate = (dateString) => {
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric'
   });
 };


 return (
   <div className="alert-container">
     <div className="alert">
       <div className="alert-content">
         <h4 className="alert-title">Membership Expiration Notice</h4>
         <p className="alert-message">
           Your {membershipData.type_of_membership} membership will expire on{' '}
           <strong>{formatDate(membershipData.expire_date)}</strong>. Please
           renew your membership to continue enjoying museum benefits.
         </p>
       </div>
       <button
         onClick={() => setShowAlert(false)}
         className="close-button"
       >
         ✕
       </button>
     </div>
   </div>
 );
};


export default MembershipExpirationAlert;