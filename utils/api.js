import axios from 'axios';

const API_KEY = 'DWc2OnG3PfuVB9zDtuDAobPtJOOGVGNZ';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';

export const fetchEvents = async (searchParams, page = 0) => {
  const { keyword, city, segmentId } = searchParams;
  const res = await axios.get(`${BASE_URL}/events.json`, {
    params: {
      apikey: API_KEY,
      keyword,
      city,
      segmentId,
      page,
      size: 20,
    },
  });
  return res.data._embedded?.events || [];
};

export const fetchClassifications = async () => {
  const res = await axios.get(`${BASE_URL}/classifications.json`, {
    params: { apikey: API_KEY },
  });
  return res.data._embedded?.classifications || [];
};

export const fetchGenreById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/classifications/genres/${id}.json`, {
      params: { apikey: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching genre by id:', error);
    return null;
  }
};
