import React from "react";
import { Badge } from "@chakra-ui/react";

export default function CustomBadge(props) {
  return (
        <Badge colorScheme="blue" width="64px">{props.text}</Badge>
  );
}