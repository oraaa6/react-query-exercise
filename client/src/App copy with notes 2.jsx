import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//useMutation - odpowiada za pobieranie danych, useMutation - odpowiada za zmianę danych

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

export default function App() {
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ["posts"], // unikalny klucz do identyfikacji query
    queryFn: (obj) =>
      wait(1000).then(() => {
        console.log(obj); // do queryFn możemy przekazać obj, dostarcza nam dodatkowo danych np queryKey, które możemy wykorzystać
        return [...POSTS];
      }), //tu musi byc funkcja (fetch/axios), która zwraca promise. ta funcjka wysyła zapytanie (tu: wysyła zapytanie i po 1000 ms zwraca posty)
  });

  // jak tworzyc klucze w useQuery, przykłady:
  // /posts -> ["posts"]
  // /posts/1 -> ["posts", post.id] (lub na sztywno 1)
  // /posts?authorId=1 -> ["posts", {authorId: 1}]
  // /posts/2/comments -> ["posts", post.id, "comments"]

  if (postQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (postQuery.isError) {
    return <pre>{JSON.stringify(postQuery.error)}</pre>; // postQuery.error - treść błędu, tu zamieniona jeszcze na JSON
  }
  function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
  return (
    <div>
      {postQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  ); // postQuery.data - nasze pobrane dane
}
