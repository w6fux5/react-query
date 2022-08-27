import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";
import { Posts } from "./Posts";

import "./App.css";

export const App = () => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
