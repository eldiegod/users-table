import { useUsersQuery } from "@/api/useUsers";
import Head from "next/head";

export default function Home() {
  const usersQuery = useUsersQuery();
  return (
    <>
      <Head>
        <title>Users view</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          users:
          {usersQuery.data?.results.map((user) => <div>{user.name.first}</div>)}
        </div>
      </main>
    </>
  );
}
