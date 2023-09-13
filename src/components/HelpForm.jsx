import React from 'react'
import { Text, Box, Divider  } from '@chakra-ui/react'
import { motion } from "framer-motion";

const BoxMotion = motion(Box);

export default function HelpForm({ openSection, section, emoji, title, helpText, delay }) {
    return (
        <BoxMotion 
          borderWidth="1px" 
          padding="12px" 
          borderRadius="8px"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: delay }}
        >
        <Text marginBottom={openSection ? "8px" : "0px"}>
          {emoji} {title}
        </Text>
        {openSection === section && (
          <Box> 
            <Divider/>
            <Box mt="4px">{helpText}</Box>
          </Box>
        )}
      </BoxMotion>
    )
}

