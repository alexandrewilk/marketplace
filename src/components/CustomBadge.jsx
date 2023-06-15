import React from "react";
import { Badge } from "@chakra-ui/react";

export default function CustomBadge(props) {
  return (
        <Badge colorScheme="pink">{props.text}</Badge>
  );
}