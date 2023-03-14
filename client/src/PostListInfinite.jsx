import { useInfiniteQuery } from "@tanstack/react-query"
import { getPostsPaginated } from "./api/posts"

export function PostListInfinite() {
  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({ // ładowanie danych nieskonczone
    queryKey: ["posts", "infinite"],
    getNextPageParam: prevData => prevData.nextPage, // zwraca co ma być następną funkcją
    // getPreviousPageParam mogę też mieć poprzednią stronę
    queryFn: ({ pageParam = 1 }) => getPostsPaginated(pageParam), // queryFunction ma dodatkowy parametr - pageParam, jest to dokładnie to co jest zwracabe w getNextPageParam czyli kolejna strona
  })

  if (status === "loading") return <h1>Loading...</h1>
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>

  return (
    <>
      <h1>Post List Infinite</h1>
      {data.pages
        .flatMap(data => data.posts)
        .map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  )
}