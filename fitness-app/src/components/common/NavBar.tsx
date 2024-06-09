import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const Navbar: React.FC = () => {
    const [isCalorieTrackerOpen, setIsCalorieTrackerOpen] = useState(false);

    const toggleCalorieTracker = () => {
        setIsCalorieTrackerOpen(!isCalorieTrackerOpen);
    };

    return (
        <nav className="bg-gray-800 h-screen w-64 flex flex-col justify-between p-4">
            <div className="text-white text-lg font-semibold space-y-4">
                <div>
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
                            <Link to="/progress" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                                Check your progress
                            </Link>
                            <Link to="/calories_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                                Calories by date
                            </Link>
                            <Link to="/delete_bydate" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                                Delete Calories by date
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
