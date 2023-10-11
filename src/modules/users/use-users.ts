import { CountryCode } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const UserSchema = z.object({
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }),
  registered: z.object({
    date: z.string(),
    age: z.number(),
  }),
  email: z.string(),
  login: z.object({
    uuid: z.string(),
  }),
  phone: z.string(),
  picture: z.object({
    thumbnail: z.string(),
  }),
  nat: z.string(),
});

const ResultsSchema = z.object({
  results: z.array(UserSchema),
});

export type User = z.infer<typeof UserSchema>;

async function fetchUsers(countryCodes: CountryCode[]) {
  const searchQueryParams = new URLSearchParams();
  searchQueryParams.set("results", "50");
  searchQueryParams.set("seed", "123");
  searchQueryParams.set("exc", "id");
  searchQueryParams.set("nat", countryCodes.join(","));

  const queryParams = searchQueryParams.toString();

  const url = "https://randomuser.me/api/?" + queryParams;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("randomuser.me api seems to be down");
  }

  const data = await res.json();

  return ResultsSchema.parse(data); //typesafe return!
}

export function useUsersQuery(props: { countryCodes: CountryCode[] }) {
  const query = useQuery({
    queryKey: ["users", ...props.countryCodes],
    queryFn: () => fetchUsers(props.countryCodes),
    keepPreviousData: true,
  });
  return query;
}
