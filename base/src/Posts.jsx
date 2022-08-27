import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(page) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (currentPage >= maxPostPage) return;
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
  }, [currentPage]);

  // replace with useQuery
  const { data, isError, isLoading, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    { keepPreviousData: true, staleTime: 2000 }
  );

  const queryClient = useQueryClient();

  if (isLoading) {
    return <div>loading..</div>;
  }

  if (isError) {
    console.log(error);
    return <h1>{` ${error}`}</h1>;
  }

  return (
    <>
      <ul>
        {data?.map((post) => (
          <li
            key={post.id}
            className="post-title"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
