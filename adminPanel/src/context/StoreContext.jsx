import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("loggedIn");
    if (storedLogin === "true") {
      setLoggedIn(true);
    }
  }, []);

  const contextValue = {
    loggedIn,
    setLoggedIn,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
