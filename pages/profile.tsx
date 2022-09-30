import type { NextPage } from "next";

import Image from "next/image";
import Head from "next/head";
import { gql } from "@apollo/client";
import { client as graphQlClient } from "../service/apolloClient";

const GET_USER = gql`
  query GetMyRepos {
    viewer {
      name
      avatarUrl
    }
  }
`;

const Home: NextPage<any> = ({ user }) => {
  console.log(user.avatarUrl);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">{user.name}</h1>
        <Image
          src="https://avatars.githubusercontent.com/u/25755402?u=98b77c96595fa3bba1067b3d219f97cb2ab6b665&v=4"
          alt="profile"
          width={200}
          height={200}
        />
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  const { data } = await graphQlClient.query({ query: GET_USER });
  return {
    props: {
      user: data?.viewer,
    },
  };
};

export default Home;
