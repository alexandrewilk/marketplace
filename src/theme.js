// theme.js
import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#F5F2ED", 
        color: "gray.800",
      },
    },
  },
});

export default customTheme;
