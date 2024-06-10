import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext'; 

const HomePage: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div>
            <div className="home-page h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://cdn.kibrispdr.org/data/1792/plank-exercise-gif-15.gif)' }}>
                <div className="flex items-center justify-center h-full bg-black bg-opacity-60">
                    <div className="text-center text-white p-8 rounded-lg">
                        <h1 className="text-5xl mb-4">Welcome to the FitSync</h1>
                        <p className="text-xl mb-8">Your journey to a healthier life starts here. Track your workouts and calories, monitor your progress, and stay motivated.</p>
                        {!isAuthenticated && (
                            <div>
                                <Link to="/login" className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mb-4">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <section className="bg-gray-100 py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">What We Offer</h2>
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Track Workouts</h3>
                                <p>Log your workout with ease and monitor your progress over time.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4">
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Track Calories</h3>
                                <p>Log your calories burnt and monitor your progress over time</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4">
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Stay Motivated</h3>
                                <p>Set goals and receive motivational tips to keep you on track.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-white py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Guiding your path to wellness</h2>
                    <p>Remember that the reason you are doing this to make your life better</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
