import { useEffect, useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialVal: T,
): [T, (data: ((data: T) => T) | T) => void] {
  const [val, setVal] = useState(() => {
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        return initialVal;
      } else {
        // console.log("localStorage is seeing ", JSON.parse(data))
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error while fetch the data from the local storage:: ", e);
    }
  });

  useEffect(() => {
    try {
      const stringified_val = JSON.stringify(val);
      // console.log("LocalStorage is setting==", val)
      localStorage.setItem(key, stringified_val);
    } catch (e) {
      console.log("Error while setting the data");
    }
  }, [val, key]); // eslint-disable-line

  return [val, setVal] as [T, typeof setVal];
}

export default useLocalStorage;
