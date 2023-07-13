import React from "react";
import { Badge, Box } from "@chakra-ui/react";

export default function CustomBadge(props) {
  return (
        <Box>
        <Badge colorScheme="blue"  width="-moz-fit-content" maxWidth="-moz-fit-content">{props.text}</Badge>
        </Box>
  );
}