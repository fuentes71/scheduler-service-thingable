export interface ITimeframeResponse {
  status: string;
  daysWeek: string[];
  interval: {
    minutes: number;
    hours: number;
  };
  recurrence: {
    startTime: string;
    endTime: string;
  };
}
