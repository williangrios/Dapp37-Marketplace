export default function Button({children, onClick, className, hoverable=true,  variant= "purple", ...rest}) {

  const variants ={
    purple: `text-white bg-indigo-600 ${ hoverable && "hover:bg-indigo-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${ hoverable && "hover:bg-indigo-200"}`,
    red: `text-white bg-red-600 ${ hoverable && "hover:bg-red-700"}`,
    white: `text-black bg-white`,
  }

  return (
    <button
      {...rest}
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed xs:px-8 xs:py-3 p-2 border rounded-md text-base font-medium ${className} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
