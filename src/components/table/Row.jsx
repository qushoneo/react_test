import React, { useEffect, useRef } from 'react';

const Row = ({ post, fields, isHighlighted, rowRefs, id }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      rowRefs.current[id] = ref.current;
    }
  }, [ref, id, rowRefs]);

  return (
    <tr
      ref={ref}
      className={`table__row ${isHighlighted ? 'table__row--highlighted' : ''}`}
      style={{ willChange: 'transform' }}
    >
      {fields.map((field) => (
        <td className={`table__cell ${field.className}`} key={field.name}>
          {post[field.name]}
        </td>
      ))}
    </tr>
  );
};

export default React.memo(Row);
