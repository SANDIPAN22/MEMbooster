import { useEffect, useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialVal: T,
): [T, (data: (data: T) => T) => void] {
  const [val, setVal] = useState(() => {
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        return initialVal;
      } else {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error while fetch the data from the local storage");
    }
  });

  useEffect(() => {
    try {
      const stringified_val = JSON.stringify(val);
      localStorage.setItem(key, stringified_val);
    } catch (e) {
      console.log("Error while setting the data");
    }
  });

  return [val, setVal];
}

export default useLocalStorage;
