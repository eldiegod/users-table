import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const LocationSchema = z.object({
  street: z.object({
    number: z.number(),
    name: z.string(),
  }),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postcode: z.number().or(z.string()),
  coordinates: z.object({
    latitude: z.string(),
    longitude: z.string(),
  }),
  timezone: z.object({
    offset: z.string(),
    description: z.string(),
  }),
});

const LoginSchema = z.object({
  uuid: z.string(),
  username: z.string(),
  password: z.string(),
  salt: z.string(),
  md5: z.string(),
  sha1: z.string(),
  sha256: z.string(),
});

const DobRegisteredSchema = z.object({
  date: z.string(),
  age: z.number(),
});

const PictureSchema = z.object({
  large: z.string(),
  medium: z.string(),
  thumbnail: z.string(),
});

const ResultsSchema = z.object({
  gender: z.string(),
  name: z.object({
    title: z.string(),
    first: z.string(),
    last: z.string(),
  }),
  location: LocationSchema,
  email: z.string(),
  login: LoginSchema,
  dob: DobRegisteredSchema,
  registered: DobRegisteredSchema,
  phone: z.string(),
  cell: z.string(),
  picture: PictureSchema,
  nat: z.string(),
});

const InfoSchema = z.object({
  seed: z.string(),
  results: z.number(),
  page: z.number(),
  version: z.string(),
});

const UsersSchema = z.object({
  results: z.array(ResultsSchema),
  info: InfoSchema,
});

async function fetchUsers() {
  const nats = `?nat=us,dk,fr,gb`;
  const path = `/api/?results=20&seed=123?exc=id,`;
  const url = "https://randomuser.me" + path;

  const res = await (await fetch(url)).json();

  return UsersSchema.parse(res); //typesafe return!
}

export function useUsersQuery(props?: { wait: number }) {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
  return query;
}
