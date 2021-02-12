let GET_MEMORY_BY_USER = '';

if (process.env.NODE_ENV === 'development') {
  GET_MEMORY_BY_USER = 'http://localhost:5001/our-quirky-adventure/us-central1/api/getMemoryByUser';
}

export const ROUTES = {
  GET_MEMORY_BY_USER
}