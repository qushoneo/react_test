import { useMemo, useRef, useState } from 'react';
import Row from './Row';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../input/Input';
import './table.css';

export const Table = ({ posts }) => {
  const [search, setSearch] = useState('');
  const [highlightedPosts, setHighlightedPosts] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const rowRefs = useRef({});

  const debouncedSearch = useDebounce(search, 300);

  const fields = useMemo(
    () => [
      { name: 'userId', label: 'User ID', className: 'mobile-hidden' },
      { name: 'id', label: 'ID', className: 'mobile-hidden' },
      { name: 'title', label: 'Title', className: 'mobile-hidden' },
      { name: 'body', label: 'Body', className: '' },
    ],
    []
  );

  const compareValues = (a, b, field, order) => {
    const valueA = a[field].toString();
    const valueB = b[field].toString();
    return order === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  };

  const sortedPosts = useMemo(() => {
    return posts.toSorted((a, b) => compareValues(a, b, sortField, sortOrder));
  }, [posts, sortField, sortOrder]);

  const handleSort = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...sortedPosts].sort((a, b) =>
      compareValues(a, b, field, newOrder)
    );

    animateSort(sorted);
    setSortField(field);
    setSortOrder(newOrder);
  };

  const animateSort = (newPosts) => {
    const initialPositions = {};
    sortedPosts.forEach((post) => {
      const dom = rowRefs.current[post.id];
      if (dom) {
        initialPositions[post.id] = dom.getBoundingClientRect();
      }
    });

    requestAnimationFrame(() => {
      newPosts.forEach((post) => {
        const rowComponent = rowRefs.current[post.id];
        if (!rowComponent) return;
        const lastRect = rowComponent.getBoundingClientRect();
        const initialRect = initialPositions[post.id];
        const deltaY = initialRect.top - lastRect.top;

        if (deltaY !== 0) {
          rowComponent.style.transform = `translateY(${deltaY}px)`;
          rowComponent.style.transition = 'transform 0s';

          requestAnimationFrame(() => {
            rowComponent.style.transform = '';
            rowComponent.style.transition = 'transform 300ms ease';
          });
        }
      });
    });
  };

  useMemo(() => {
    if (!debouncedSearch) {
      setHighlightedPosts([]);
      return;
    }

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        post.body.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    console.log(filtered, debouncedSearch);

    setHighlightedPosts(filtered);
  }, [debouncedSearch, posts]);

  const highlightedMap = useMemo(() => {
    const map = new Set();
    highlightedPosts.forEach((p) => map.add(p.id));
    return map;
  }, [highlightedPosts]);

  return (
    <>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search'
      />
      <table border='1'>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th
                key={index}
                onClick={() => handleSort(field.name)}
                className={`table__header ${field.className}`}
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPosts.map((post) => (
            <Row
              key={post.id}
              post={post}
              fields={fields}
              isHighlighted={highlightedMap.has(post.id)}
              rowRefs={rowRefs}
              id={post.id}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
