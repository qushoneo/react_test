import { useState } from 'react';
import './App.css';
import { useFetch } from './hooks/useFetch';
import { Table } from './components/table/Table';

function App() {
  const [page, setPage] = useState(1);

  const { data: posts, loading } = useFetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=25&_page=${page}`
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Table posts={posts} />

      <div className='table__pagination'>
        {page > 1 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}

        <p>{page}</p>

        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>
  );
}

export default App;
