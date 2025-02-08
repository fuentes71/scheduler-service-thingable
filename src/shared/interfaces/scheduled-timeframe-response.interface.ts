import { ITimeframeResponse } from './timeframe-response.interface';

export interface IScheduledTimeframeResponse extends ITimeframeResponse {
  scheduledStart: string;
}
