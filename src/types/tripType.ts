import { MetaType } from "./commonType";

export interface RequestCreateType {
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface TripListItemType {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface ResponseTripListType {
  data: TripListItemType[];
  meta: MetaType;
}
