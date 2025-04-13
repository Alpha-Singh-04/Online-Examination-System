import api from './api';

export const getPlaceholderImage = (width, height) => {
    // Return the full URL that can be used in img src
    return `/api/placeholder/${width}/${height}`;
};

// If you need to fetch the image as data
export const fetchPlaceholderImage = async (width, height) => {
    try {
        const response = await api.get(`/placeholder/${width}/${height}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching placeholder image:', error);
        throw error;
    }
};
