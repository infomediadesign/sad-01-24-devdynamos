import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faBolt, faHeart, faBrain } from '@fortawesome/free-solid-svg-icons';
import Navbar from './common/NavBar';
import Calories from './Calories';
import carousel from './images/carousel.png';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-cover bg-center">
      <div className="w-64">
        <Navbar />
      </div>
      <div className="flex-grow p-4 bg-white bg-opacity-75 m-0 ml-32">
        <div className="mb-4 h-48 overflow-hidden">
          <img src={carousel} alt="Carousel" className="w-full h-full object-cover" />
        </div>
        <Calories />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">How Working Out Affects Good Hormones</h2>
          <div className="space-y-6">
            <article className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <FontAwesomeIcon icon={faSmile} className="mr-2" />
                Endorphins
              </h3>
              <p>Endorphins are known as "feel-good" hormones because they act as natural painkillers and mood elevators. Regular exercise increases endorphin production, leading to feelings of euphoria commonly known as "runner's high."</p>
            </article>
            <article className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <FontAwesomeIcon icon={faBolt} className="mr-2" />
                Dopamine
              </h3>
              <p>Dopamine plays a crucial role in reward, motivation, memory, attention, and even regulating body movements. Physical activity can boost dopamine levels, improving mood and focus.</p>
            </article>
            <article className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <FontAwesomeIcon icon={faHeart} className="mr-2" />
                Serotonin
              </h3>
              <p>Serotonin is a key hormone that stabilizes mood, feelings of well-being, and happiness. Exercise can increase serotonin production, helping to reduce depression and anxiety.</p>
            </article>
            <article className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <FontAwesomeIcon icon={faBrain} className="mr-2" />
                Adrenaline
              </h3>
              <p>Adrenaline is released in response to stress and prepares your body for a "fight or flight" response. Exercise increases adrenaline levels, which can enhance your energy and performance during physical activity.</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
