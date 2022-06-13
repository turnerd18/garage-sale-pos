import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, FormControl, IconButton, InputAdornment, InputBase, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';
import { CheckCircle, Close, Send } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
});

const theme = createTheme({
  status: {
    inactive: grey[500],
  },
});

export default function App() {
  const [currentPerson, setPerson] = React.useState('Clothes')
  const [items, setItems] = React.useState([])
  const [customValue, setCustomValue] = React.useState('')

  const values = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 10]

  const PersonButton = ({ person, color }) => (
    <Button
      variant={person === currentPerson ? "contained" : "outlined"}
      color={color}
      onClick={() => setPerson(person)}>
      {person}
    </Button>
  )

  const submitCustomValue = () => {
    setItems([
      { person: currentPerson, value: customValue },
      ...items
    ])
    setCustomValue('')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} height='100vh'>
        <Stack spacing={1} direction="row" justifyContent='center'>
          <PersonButton person='Clothes' color='error' />
          <PersonButton person='Turner' color='secondary' />
          <PersonButton person='Kim' color='success' />
          <PersonButton person='Turenne' color='info' />
          <PersonButton person='Bulmer' color='warning' />
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Grid container spacing={1}>
              {values.map(value =>
                <Grid item xs={4}>
                  <Button
                    onClick={() => setItems([
                      { person: currentPerson, value },
                      ...items
                    ])
                    }
                  >
                    {formatter.format(value)}
                  </Button>
                </Grid>)
              }
              <Grid item xs={8}>

              </Grid>
            </Grid>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Custom</InputLabel>
              <OutlinedInput
                label='Custom'
                color='primary'
                type='number'
                inputProps={{ inputMode: 'numeric' }}
                value={customValue}
                onChange={event => {
                  setCustomValue(parseFloat(event.target.value))
                }}
                onKeyDownCapture={event => { if (event.keyCode == 13) submitCustomValue() }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={submitCustomValue}
                      edge="end"
                      color='success'
                    >
                      <CheckCircle />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Item>
              <b>Total: {formatter.format(items.reduce((sum, item) => sum + item.value, 0))}</b>
            </Item>
          </Grid>

          <Grid item xs={3}>
            {items.map((item, index) =>
              <Item >
                {item.person} {formatter.format(item.value)}
                <IconButton
                  color='error'
                  onClick={() => setItems([
                    ...items.slice(0, index),
                    ...items.slice(index + 1)
                  ])}>
                  <Close />
                </IconButton>
              </Item>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
