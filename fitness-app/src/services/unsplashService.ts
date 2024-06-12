import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'aFrUiF_nCu_YQPJPQWfUZoOgTZ2WQ0Cy08J8roo9s_Q'; // Replace with your Unsplash Access Key

export const fetchUnsplashImage = async (query: string) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query,
        client_id: UNSPLASH_ACCESS_KEY,
        count: 1,
      },
    });

    return response.data[0]?.urls?.regular;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};
