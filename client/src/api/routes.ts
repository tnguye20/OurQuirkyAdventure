let GET_MEMORY_BY_USER = 'https://us-central1-our-quirky-adventure.cloudfunctions.net/api/getMemoryByUser';

if (process.env.NODE_ENV === 'development') {
  GET_MEMORY_BY_USER = `http://${window.location.hostname}:5001/our-quirky-adventure/us-central1/api/getMemoryByUser`;
}

export const ROUTES = {
  GET_MEMORY_BY_USER
}