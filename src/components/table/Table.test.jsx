import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';

const mockPosts = [
  { id: '1', title: 'post 1', body: 'post msg 1', userId: 1 },
  { id: '2', title: 'post 2', body: 'post msg 2 ', userId: 2 },
];

const fields = [
  { name: 'userId', label: 'User ID', className: 'mobile-hidden' },
  { name: 'id', label: 'ID', className: 'mobile-hidden' },
  { name: 'title', label: 'Title', className: 'mobile-hidden' },
  { name: 'body', label: 'Body', className: '' },
];

describe('Table component', () => {
  it("renders headers and Row's", () => {
    render(<Table posts={mockPosts} fields={fields} />);

    fields.forEach((field) => {
      expect(screen.getByText(field.label)).toBeDefined();
    });

    expect(screen.getByText('post 1')).toBeDefined();
    expect(screen.getByText('post msg 1')).toBeDefined();
    expect(screen.getAllByText('1')[0]).toBeDefined();
  });
});
