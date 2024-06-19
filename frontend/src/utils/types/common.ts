export type LOCATION = {
  id: string;
  name: string;
  customer_id: string;
};

export type ROOM = {
  id: string;
  name: string;
  location_id: string;
};

export type CUSTOMER = {
  id: string;
  name: string;
};
