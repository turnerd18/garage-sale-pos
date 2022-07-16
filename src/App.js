import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
}));

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
});

const bucketColorMap = {
  'Kim': 'success',
  'NIC': 'secondary',
  'POT': 'error',
  'Cas': 'info',
  'Gma': 'warning',
  'JT': 'primary'
}


export default function App() {
  const [currentBucket, setBucket] = React.useState('Clothes')
  const [items, setItems] = React.useState([])
  const [customValue, setCustomValue] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const presetAmounts = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 10]

  const BucketButton = ({ bucket, color }) => (
    <Button
      variant={bucket === currentBucket ? "contained" : "outlined"}
      color={color}
      onClick={() => setBucket(bucket)}>
      {bucket}
    </Button>
  )

  const submitCustomValue = () => {
    if (!customValue) return

    setItems([
      { bucket: currentBucket, amount: customValue },
      ...items
    ])
    setCustomValue('')
  }

  const submitTransaction = async () => {
    try {
      setIsSubmitting(true)
      await fetch('https://us-central1-dtdevel-garge-sale-pos.cloudfunctions.net/appendRow', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      })
    } catch {
      return
    } finally {
      setIsSubmitting(false)
    }

    setItems([])
    setCustomValue('')
  }

  return (
    <Box sx={{ flexGrow: 1 }} height='100vh'>

      <Stack spacing={0} direction="row" justifyContent="space-evenly">
        {Object.entries(bucketColorMap).map(([bucket, color]) =>
          <BucketButton bucket={bucket} color={color}/>)
        }
      </Stack>

      <Grid container spacing={2} marginTop='10px'>
        <Grid item xs={8}>

          <Grid container spacing={1}>
            {presetAmounts.map(amount =>
              <Grid item xs={4} key={amount}>
                <Button
                  onClick={() => setItems([
                    { bucket: currentBucket, amount },
                    ...items
                  ])}
                >
                  {formatter.format(amount)}
                </Button>
              </Grid>)
            }
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
              onKeyDownCapture={event => { if (event.keyCode === 13) submitCustomValue() }}
              endAdornment={
                !!customValue && <InputAdornment position="end">
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

          <Stack spacing={2} direction="column" justifyContent='center' textAlign='center'>
            <b>Total: {formatter.format(items.reduce((sum, item) => sum + item.amount, 0))}</b>
            <Button
              variant="contained"
              color='primary'
              disabled={!items.length || isSubmitting}
              onClick={submitTransaction}>
              Submit
            </Button>
          </Stack>

        </Grid>

        <Grid item xs={4} sx={{ maxHeight: '95vh', overflowY: 'scroll' }}>
          {items.map((item, index) =>
            <Item sx={{ color: `${bucketColorMap[item.bucket]}.light` }} key={index}>
              {item.bucket} {formatter.format(item.amount)}
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
  );
}
