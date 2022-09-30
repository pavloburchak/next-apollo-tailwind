import type { NextPage } from "next";
import Head from "next/head";
import { gql, useQuery, useMutation } from "@apollo/client";
import Link from "next/link";

const GET_REPOS = gql`
  query GetMyRepos {
    viewer {
      repositories(first: 6) {
        nodes {
          id
          name
          url
          stargazerCount
          stargazers(first: 5) {
            nodes {
              name
            }
          }
        }
      }
      name
    }
  }
`;

const STAR_REPO = gql`
  mutation addStar($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        stargazerCount
      }
    }
  }
`;

const UNSTAR_REPO = gql`
  mutation removeStar($starrableId: ID!) {
    removeStar(input: { starrableId: $starrableId }) {
      starrable {
        stargazerCount
      }
    }
  }
`;

const Home: NextPage<any> = () => {
  const { data, refetch, loading: loadingGet } = useQuery(GET_REPOS);
  const [addStar, { loading: loadingAdd }] = useMutation(STAR_REPO);
  const [removeStar, { loading: loadingRemove }] = useMutation(UNSTAR_REPO);

  const loading = loadingGet || loadingAdd || loadingRemove;
  const name = data?.viewer.name;
  const repos = data?.viewer.repositories.nodes || [];

  const toggleStar = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
    users: any
  ) => {
    event.preventDefault();
    const isStarred = users.some((item: any) => item.name === name);

    if (!isStarred) {
      addStar({ variables: { starrableId: id } }).then(() => {
        refetch();
      });
    } else {
      removeStar({ variables: { starrableId: id } }).then(() => {
        refetch();
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Graph QL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          {loading ? "Loading... " : `Welcome to${" "}`}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
          <div>
            <Link href="/profile">Profile</Link>
          </div>
        </h1>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          {repos.map((repo: any) => (
            <a
              href={repo.url}
              className="flex justify-between mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
              key={repo.name}
            >
              <h3 className="text-2xl font-bold">
                {repo.name.slice(0, 13)} &rarr;
              </h3>
              <button
                className={`border-2 rounded ${
                  repo.stargazerCount > 0
                    ? "border-amber-300"
                    : "border-gray-800"
                } p-1 ${
                  repo.stargazerCount > 0 ? "text-amber-300" : "text-gray-800"
                } ${repo.stargazerCount > 0 && "bg-gray-600"}
                hover:bg-gray-400 transition-all duration-200 ease-in w-20`}
                onClick={(event) =>
                  toggleStar(event, repo.id, repo.stargazers.nodes)
                }
              >
                Stars {repo.stargazerCount}
              </button>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
