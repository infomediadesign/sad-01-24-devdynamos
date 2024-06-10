// import React from 'react';
// import { useParams } from 'react-router-dom';
// import Navbar from './common/NavBar';
// import Calories from './Calories';

// const Dashboard: React.FC = () => {
//   const { username } = useParams<{ username: string }>();

//   return (
//     <div
//       className="flex min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url('https://img.freepik.com/free-photo/white-sneakers-pink-weights-with-copy-space_23-2148343777.jpg')` }}
//     >
//       <div className="w-64"> {/* Set a fixed width for the sidebar */}
//         <Navbar />
//       </div>
//       <div className="flex-grow p-4 bg-white bg-opacity-75">
//         <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
//         <Calories />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './common/NavBar';
import Calories from './Calories';

const Dashboard: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('https://img.freepik.com/free-photo/white-sneakers-pink-weights-with-copy-space_23-2148343777.jpg')` }}
    >
      <div className="w-64"> {/* Set a fixed width for the sidebar */}
        <Navbar />
      </div>
      <div className="flex-grow p-4 bg-white bg-opacity-75">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        <Calories />
        <h2 className="text-xl font-bold mt-8 mb-4">Fitness and Calorie-related Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Fitness Video 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://youtu.be/e_eJRDl2J6Y?si=DjboIM_3dB157v9p"
              title="Fitness Video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID_3"
              title="Fitness Video 3"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
