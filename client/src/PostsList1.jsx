import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api/posts"; // funkcja pobierajaca dane

export default function PostsList1() {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    // refetchInterval: 1000 ---> jak często nasze dane mają się odświeżać, podane w [ms]
    // initialData: [{ id: 1, title: "Initial Data" }], // poazuje się na początku i nie wykonuje żadnych innych pobrań, ponieważ initialData są to prawidłowe dane i przechowywane w pamięci podręcznej
    placeholderData: [{ id: 1, title: "Initial Data" }], // pokazje się  na początku, a w międzyczasie są pobierane dane i kiedy zostaną one pobrane, to są one podmieniane z placeholderData
  });

  // można użyć hooka useQueries jesli chce przekazać tablicę z wieloma queries które chce odpalić np:
  // const queries = useQueries({
  //   queries: postsQuery.data.map((post) => {
  //     return {
  //       queryKe: ["posts", post.id],
  //       queryFn: () => getPosts(post.id),
  //     };
  //   }),
  // });

  if (postsQuery.status === "loading") return <h1>Loading...</h1>;
  if (postsQuery.status === "error") {
    return <h1>{JSON.stringify(postsQuery.error)}</h1>;
  }

  return (
    <div>
      <h1>Posts List 1</h1>
      <ol>
        {postsQuery.data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ol>
    </div>
  );
}
