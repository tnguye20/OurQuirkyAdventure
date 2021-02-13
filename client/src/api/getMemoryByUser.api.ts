import axios from 'axios';
import { FilterCriteria, Memory } from '../interfaces';
import { ROUTES } from './routes';

interface APIResponse {
  body: Memory[]
  statusCode?: number,
  headers?: Record<string, any>
}

export const getMemoryByUser = async (idToken: string, filter?: FilterCriteria, limit?: number): Promise<Memory[]> => {
    try {
        const url = ROUTES.GET_MEMORY_BY_USER;
        const options = {
            headers: {
                "Authorization": idToken
            }
        };

        const data: Record<string, any> = {};
        if (filter) data.filter = filter;
        if (limit) data.limit = limit;

        const rs = await axios.post(url, data, options);

        const response: APIResponse = rs.data;
        return response.body;
    }
    catch (error) {
        if (error.response) {
            // const { status } = error.response;
            const { errorMsg, message } = error.response.data;
            throw new Error(message ? message : errorMsg);
        }
        throw new Error('Unexpected Error Happened. Please try again in a few minutes.');
    }
}
