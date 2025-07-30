import './input.css';

export const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      type='text'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='input'
    />
  );
};
