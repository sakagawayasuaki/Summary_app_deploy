import { IconButton } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'


function RoundButton() {
    return(
        <IconButton
            isRound={true}
            variant='solid'
            colorScheme='teal'
            aria-label='Done'
            fontSize='20px'
            icon={<CheckIcon />}
        />
    )
}

export default RoundButton;