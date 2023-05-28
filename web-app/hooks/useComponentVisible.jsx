import { useEffect, useRef } from "react";

// This file is for checking if user click outside the component
const useComponentVisible = (isComponentVisible, setIsComponentVisible) => {
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref };
};

export default useComponentVisible;
