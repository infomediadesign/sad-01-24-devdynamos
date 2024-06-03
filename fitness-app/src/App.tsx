import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SetCalorieGoal from './components/SetCalorieGoal';
import LogCalories from './components/LogCalories';
import ViewProgress from './components/ViewProgress';
import DeleteCalorieGoal from './components/DeleteCalorieGoal';


const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    <ul className="flex space-x-4 p-4 bg-blue-500 text-white">
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/muscle-group-map">Muscle Group Map</Link>
                        </li>
                    </ul>
                </nav>
                <div>
        <nav>
          <ul>
            <li><a href="/set-goal">Set Calorie Goal</a></li>
            <li><a href="/log-calories">Log Calories</a></li>
            <li><a href="/viewprogress">View Progress</a></li>
            <li><a href="/delete-goal">Delete Goal</a></li>
          </ul>
        </nav>
      
      </div>
            </header>
            <main className="App-main">
                <Outlet />
            </main>
        </div>
    );
};


export default App;
