import React from "react";
import { useUsersQuery } from "@/modules/users/use-users";
import { UsersTable } from "@/modules/users/users-table";
import Head from "next/head";
import { CountryCode } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <Head>
        <title>Users view</title>
      </Head>
      <main className="min-h-screen">
        <div className="container flex flex-col items-center justify-center px-4 py-16 ">
          <div className="w-[900px]">
            <h1 className="text-xl font-bold">Users Table</h1>
            <UsersTable />
          </div>
        </div>
      </main>
    </>
  );
}
