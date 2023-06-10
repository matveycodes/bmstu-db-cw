interface User {
  id: string;
  status: string;
  is_active: boolean;
  role: string;
  date_joined: string;
  middle_name: string | null;
  last_name: string | null;
  first_name: string | null;
  email: string | null;
  phone: string;
  birthdate: string | null;
  age: number | null;
}

export { User };
