export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
};

export type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type RawUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  age: number;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

export type ProcessedUser = {
  id: string;
  username: string;
  address: Address;
  age: number;
  companyName: string;
};
