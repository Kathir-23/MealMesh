

const ResponsiveTable = ({ children, className }) => {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg">
      <div className={`inline-block min-w-full align-middle ${className || ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveTable;