import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { logger } from 'firebase-functions';

const {
  OK,
  BAD_REQUEST
} = StatusCodes;

interface ResponseBody {
  body: Record<string, any> | boolean | string | Array<string> | Array<Record<string, unknown>>
  statusCode?: number,
  headers?: Record<string, any>
}

type Controller = (req: Request) => Promise<ResponseBody>;

const expressCallback = (controller: Controller) => (
  async (req: Request, res: Response) => {
    try {
      const response = await controller(req);
      const { headers, statusCode, body } = response;
      if (headers !== null && headers !== undefined) {
        res.set(headers);
      }
      res.status(statusCode !== undefined ? statusCode : OK).json({
        body
      });
    }
    catch (error) {
      logger.error(error);
      res.status(BAD_REQUEST).json({
        isError: true,
        body: error.message
      });
    }
  }
);

export default expressCallback;
