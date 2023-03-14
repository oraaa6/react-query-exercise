import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api/posts";

export default function PostsList2() {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  // dane są pobierane w tle, tzn. pokazywane są stare dane (które są w stanie stale), a pobieranie dzieje się jednocześnie i wtedy kiedy zostaną pobrane - wyświetlą się nowe dane
  // można sprawdzić status pobierania poprzez postQuery.fetchStatus. statusy są: fetching(pobieranie), idle(bezczynność), paused(pauza np brak neta)
  if (postsQuery.status === "loading") return <h1>Loading...</h1>;
  if (postsQuery.status === "error") {
    return <h1>{JSON.stringify(postsQuery.error)}</h1>;
  }

  return (
    <div>
      <h1>Post List 2</h1>
      <ol>
        {postsQuery.data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ol>
    </div>
  );
}
