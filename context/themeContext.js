import { createContext } from "react";

const ThemeContext = createContext({
  theme: "theme-light"
});

function ThemeContextProvider(props) {
  const theme = "theme-light"
  return (
    <ThemeContext.Provider value={{ theme: theme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeContextProvider };