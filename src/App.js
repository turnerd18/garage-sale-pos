import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Delete } from '@mui/icons-material';

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

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function App() {
  const [person, setPerson] = React.useState('Turner')
  const [items, setItems] = React.useState([])

  const values = [0.25, 0.5, 1, 2, 3, 4, 5]

  return (
    <Box sx={{ flexGrow: 1 }} height='100vh'>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <ToggleButtonGroup
            orientation="vertical"
            value={person}
            onChange={(e, person) => setPerson(person)}
            exclusive
            flexGrow={1}
          >
            <ToggleButton value="Clothes" >
              Clothes
            </ToggleButton>
            <ToggleButton value="Turner" >
              Turner
            </ToggleButton>
            <ToggleButton value="Kim" >
              Kim
            </ToggleButton>
            <ToggleButton value="Turenne" >
              Turenne
            </ToggleButton>
            <ToggleButton value="Bulmer" >
              Bulmer
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={8}>
          {/* <Item>xs=4</Item> */}
          <Grid container spacing={1}>
            {values.map(value =>
              <Grid item xs={4}>
                <Button
                  onClick={() => setItems([
                    {
                      person, value
                    },
                    ...items
                  ])
                  }
                >
                  {formatter.format(value)}
                </Button>
              </Grid>)
            }
          </Grid>
        </Grid>

        <Grid item xs={3}>
          {items.map((item, index) =>
            <Item>
              {item.person} {formatter.format(item.value)}
              <IconButton
                onClick={() => setItems([
                  ...items.slice(0, index),
                  ...items.slice(index + 1)
                ])}>
                <Delete />
              </IconButton>
            </Item>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
