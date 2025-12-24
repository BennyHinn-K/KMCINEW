import React from 'react';

const ContactMap = () => {
  return (
    <div className="w-full h-[450px] rounded-lg shadow-md overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2582546999834!2d36.68609709999999!3d-1.2444361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1f88d82eddb3%3A0xb1f4df6a57dd5e8!2sKingdom%20Missions%20Centre%20In&#39;t%20Ministries!5e1!3m2!1sen!2ske!4v1766499089504!5m2!1sen!2ske" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="KMCI Location Map"
      ></iframe>
    </div>
  );
};

export default ContactMap;
