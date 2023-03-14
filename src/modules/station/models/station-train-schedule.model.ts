export class StationTrainSchedule {
  train_id: string;

  startStationDepartureTime: string;

  endStationArrivalTime: string;

  arrivalToCurrentStationTime?: string;

  departureFromCurrentStationTime?: string;
}
