import * as React from 'react';

import Grid from '@material-ui/core/Grid';

export const NoSlide: React.FC<{dark?: boolean}> = ({dark}) => {
  return (
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh'}}
    >
      <Grid item xs={10} sm={6}>
        <img alt="Default for no slide" src={process.env.PUBLIC_URL + '/noSlide.gif'} className='noslide'/>
        <p style={{textAlign: "center", color: dark ? 'black' : 'white'}}>Awww! There is nothing to show ❤</p>
      </Grid>
    </Grid>
  )
}
