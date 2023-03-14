import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { createPost } from "./api/posts";
import Post from "./Post";

export function CreatePost({ setCurrentPage }) {
  const titleRef = useRef();
  const bodyRef = useRef();
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: () => createPost, // podobna do queryFn, musi zwracac promise
    onSuccess: (data, context) => {
      // tutaj context to jest to co jest zwrócone z onMutate, czyli tu będzie: {hi: "Bye"}, przydaje się jesli chce się coś zroić przed funkcją mutateFn lub chce się mieć dostęp do kontekstu w onSuccess
      queryClient.setQueryData(["posts", data.id], data); // jest to reczna aktualizacja pamięci podręcznej - umieszczenie nowego postu w pamięci podręcznej, ustawienie danych zapytania, w tym przypadku zastosowane, w celu aby po dodaniu noweg postu, nie był wznawiany fetch i żeby dane pojawiały się od razu. zamiast data moze byc funkcja (oldData) = {...} która przyjmuje stare dane
      queryClient.invalidateQueries(["posts"], { exact: true }); // update danych, przyjmuje queryKey
      setCurrentPage(<Post id={data.id} />); // ustawia komponent z id postu
    },
    onMutate: (someVariables) => {
      return { hi: "Bye" };
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createPostMutation.mutate({
      title: titleRef.current.value,
      body: bodyRef.current.value,
    });
  }

  return (
    <div>
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input id="body" ref={bodyRef} />
        </div>
        <button disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
