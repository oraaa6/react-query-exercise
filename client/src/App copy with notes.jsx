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
    queryFn: () => wait(1000).then(() => [...POSTS]), //tu musi byc funkcja (fetch/axios), która zwraca promise. ta funcjka wysyła zapytanie (tu: wysyła zapytanie i po 1000 ms zwraca posty)
  });

  console.log(POSTS);
  const newPostMutation = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(
        () => POSTS.push({ id: crypto.randomUUID(), title }) // crypto.randomUUID() - metoda JSowa, tworzy randomowy ciąg znaków
      );
    }, // tu musi być funkcja, która zwraca promise.
    onSuccess: () => {
      // jeśli udało się wykonac request (mutationFn) to wykona się funkcja onSuccess.
      queryClient.invalidateQueries(["posts"]); // invalidateQueries powoduje zsynchronizowanie danych w cache, po dodaniu danych. Jako argument przyjmuje klucz query, jakie ma zsynchronizować
    },
  });
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
      <button onClick={() => newPostMutation.mutate("New Post")}>
        {/* newPostMutation.mutate() --> funkcja mutate, jest funkcją, która była przekazywana przy useMutation tj. mutationFn:*/}
        Add New
      </button>
    </div>
  ); // postQuery.data - nasze pobrane dane
}
