import React from 'react'
import {Stack,CircularProgress} from "@mui/material"

const Loader = ({size}) => {

  return (

    <>
    <Stack spacing={2} direction="row" alignItems="center">
      <CircularProgress size={size} color='inherit'/>
    </Stack>
    </>

  )
}

export default Loader