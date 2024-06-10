import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const Navbar: React.FC = () => {
  const [isCalorieTrackerOpen, setIsCalorieTrackerOpen] = useState(false);

  const toggleCalorieTracker = () => {
    setIsCalorieTrackerOpen(!isCalorieTrackerOpen);
  };

  return (
    <nav className="bg-gray-800 h-full w-64 fixed flex flex-col justify-between p-4">
      <div className="text-white text-lg font-semibold space-y-4">
      <Link to="/dashboard/progressTracking" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
          Progress Tracking
        </Link>
        <Link to="/routines" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
          Workout Routines
        </Link>
        <Link to="/muscle-groups" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
          Muscle Groups
        </Link>
        <div>
          <button onClick={toggleCalorieTracker} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 w-full text-left">
            Calorie Tracker
          </button>
          {isCalorieTrackerOpen && (
            <div className="pl-4 space-y-2">
              <Link to="/dashboard/set-your-calorie-goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Set Your Calorie Goal
              </Link>
              <Link to="/dashboard/log-calories" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Log Calories
              </Link>
              <Link to="/dashboard/cal-progress-tracking" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Check Your Progress
              </Link>
              <Link to="/dashboard/calories-by-date" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Calories by Date
              </Link>
              <Link to="/dashboard/delete-calories-by-date" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Delete Calories by Date
              </Link>
              <Link to="/dashboard/delete-goal" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
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
