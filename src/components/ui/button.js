export const Button = ({ children, ...props }) => (
    <button
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      {...props}
    >
      {children}
    </button>
  );
  