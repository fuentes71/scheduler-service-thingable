import { IScheduledTimeframeResponse } from './scheduled-timeframe-response.interface';
import { ITimeframeResponse } from './timeframe-response.interface';

export interface IGetAllTimeframe {
  immediateTimeframe?: ITimeframeResponse;
  scheduledTimeframe?: IScheduledTimeframeResponse;
}
