import React from 'react'
import { Text, Box, Divider  } from '@chakra-ui/react'

export default function HelpForm({ openSection, section, emoji, title, helpText }) {
    return (
        <Box borderWidth="1px" padding="12px" borderRadius="8px">
        <Text marginBottom={openSection ? "8px" : "0px"}>
          {emoji} {title}
        </Text>
        {openSection === section && (
          <Box> 
            <Divider/>
            <Box mt="4px">{helpText}</Box>
          </Box>
        )}
      </Box>
    )
}

