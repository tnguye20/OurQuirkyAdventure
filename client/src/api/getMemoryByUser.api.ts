import axios from 'axios';
import { STATUS_CODES } from 'http';
import { FilterCriteria, Memory, GetMemoryByUserParams } from '../interfaces';
import { ROUTES } from './routes';

interface APIResponse {
  body: Memory[]
  statusCode?: number,
  headers?: Record<string, any>
}

export const getMemoryByUser = async (params: GetMemoryByUserParams): Promise<Memory[]> => {
    const { idToken, filterCriteria, limit, startAt, startAfter } = params;
    try {
        const url = ROUTES.GET_MEMORY_BY_USER;
        const options = {
            headers: {
                "Authorization": idToken
            }
        };

        const data: Record<string, any> = {};
        if (filterCriteria) data.filter = filterCriteria;
        if (limit) data.limit = limit;
        if (startAt) data.startAt = startAt;
        if (startAfter) data.startAfter = startAfter;

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
        console.log(error);
        throw new Error('Unexpected Error Happened. Please try again in a few minutes.');
    }
}
