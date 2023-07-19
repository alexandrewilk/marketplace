import React from "react";
import { Circle, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";

export default function IconBadge({icon, text, marginRight}) {
  return (
    <Flex align="center" justify="center" mr={marginRight}>
      <Circle p={1} bg="blue.100">
        <Icon as={icon} color="blue.600" boxSize={4} />
      </Circle>
      <Text ml={1} fontSize='12px'>{text}</Text>
    </Flex>
  );
}
