// import React, { useEffect, useState } from "react";
// import NotificationService from "./NotificationService";

// const GlobalNotification = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     NotificationService.connectWebSocket("user-id", (message) => {
//       setNotifications((prev) => [...prev, message]);
//     });

//     return () => {
//       NotificationService.disconnectStompWebSocket();
//     };
//   }, []);

//   return (
//     <div className="global-notification">
//       {notifications.map((notif, index) => (
//         <div key={index} className="notification-item">
//           {notif}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GlobalNotification;
