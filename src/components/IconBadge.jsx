import React from "react";
import { Badge, Flex, Icon } from "@chakra-ui/react";

export default function IconBadge({icon, text, marginRight}) {
  return (
    <Badge p={2} mr={marginRight}>
      <Flex align="center" justify="center">
        <Icon as={icon} mr={1} boxSize={4} />
        {text}
      </Flex>
    </Badge>
  );
}
