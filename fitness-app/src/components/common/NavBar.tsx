// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Logout from './Logout';
// import { getUserProfile } from '../../services/userServices';

// const Navbar: React.FC = () => {
//   const [isCalorieTrackerOpen, setIsCalorieTrackerOpen] = useState(false);
//   const [profile, setProfile] = useState<any>(null);

//   const toggleCalorieTracker = () => {
//     setIsCalorieTrackerOpen(!isCalorieTrackerOpen);
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profileData = await getUserProfile();
//         setProfile(profileData);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   return (
//     <nav className="bg-gray-800 h-full w-64 fixed flex flex-col justify-between p-4 text-white">
//       <div className="text-lg font-semibold space-y-4">
//         {profile ? (
//           <div className="mb-4">
//             <h2 className="text-xl">Welcome, {profile.username}!</h2>
//             {profile.photo && <img src={profile.photo} alt="User Photo" className="w-16 h-16 rounded-full object-cover mt-2" />}
//           </div>
//         ) : (
//           <div>Loading...</div>
//         )}
//          <Link to="/profile" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//           My Account
//         </Link>
//         <button onClick={toggleCalorieTracker} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 w-full text-left">
//           Calorie Tracker
//         </button>
//         {isCalorieTrackerOpen && (
//           <div className="pl-4 space-y-2">
//             <Link to="/goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Set Your Calorie Goal
//             </Link>
//             <Link to="/log" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Log Calories
//             </Link>
//             <Link to="/progress" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Check Your Progress
//             </Link>
//             <Link to="/calories_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Calories by Date
//             </Link>
//             <Link to="/delete_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Delete Calories by Date
//             </Link>
//             <Link to="/delete_goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//               Delete Goal
//             </Link>
//           </div>
//         )}
//         <Link to="/progressTracking" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//           Progress Tracking
//         </Link>
//         <Link to="/routines" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//           Workout Routines
//         </Link>
//         <Link to="/muscle-groups" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//           Muscle Groups
//         </Link>
//       </div>
//       <div>
//         <Logout />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaClipboardList, FaDumbbell, FaUtensils, FaChartLine, FaHeart, FaTrash, FaCalendarAlt, FaFire } from 'react-icons/fa';
import Logout from './Logout';
import { getUserProfile } from '../../services/userServices';

const Navbar: React.FC = () => {
  const [isCalorieTrackerOpen, setIsCalorieTrackerOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const toggleCalorieTracker = () => {
    setIsCalorieTrackerOpen(!isCalorieTrackerOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <nav className="bg-gray-800 h-full w-64 fixed flex flex-col justify-between p-4">
      <div className="text-white text-lg font-semibold space-y-4">
        <div>
          <Link to="/progressTracking" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
            Progress Tracking
          </Link>
          <Link
            to="/routines"
            className="relative block px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 border border-blue-500 shadow-lg shadow-blue-500/50"
          >
            AI Workout Planner
            <span className="absolute top-0 right-0 mt-1 mr-2 text-xs font-bold text-red-600 bg-white rounded-full px-2 py-0.5">
              New
            </span>
          </Link>
          <Link to="/muscle-groups" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
            Muscle Groups
          </Link>
          <button onClick={toggleCalorieTracker} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 w-full text-left">
            Calorie Tracker
          </button>
          {isCalorieTrackerOpen && (
            <div className="pl-4 space-y-2">
              <Link to="/goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Set Your Calorie Goal
              </Link>
              <Link to="/log" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Log Calories
              </Link>
              <Link to="progress" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Check Your Progress
              </Link>
              <Link to="/calories_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Calories by Date
              </Link>
              <Link to="/delete_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Delete Calories by Date
              </Link>
              <Link to="/delete_goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Delete Goal
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <Logout />
      </div>
    </nav>
  );
};

export default Navbar;
