import * as React from 'react';
import { Category, Memory } from '../../interfaces';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useUserValue } from '../../contexts';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import { MemoryDao, UserCriteriaDao } from '../../daos';

const EditMemory: React.FC<{
  memory: Memory,
  open: boolean,
  handleClose: () => void
}> = ({ memory, open, handleClose }) => {
  const { user } = useUserValue();
  const memoryDao = new MemoryDao(memory.id!);

  const [ tags, setTags ] = React.useState<Array<string>>(memory.tags);
  const [ defaultTags, setDefaultTags ] = React.useState<Array<string>>([]);
  const [ title, setTitle ] = React.useState<string>(memory.title);

  const [ city, setCity ] = React.useState<string>(memory.city ? memory.city : '');
  const [ neighbourhood, setNeighbourhood ] = React.useState<string>(memory.neighbourhood ? memory.neighbourhood : '');
  const [ state, setState ] = React.useState<string>(memory.state ? memory.state : '');
  const [ country, setCountry ] = React.useState<string>(memory.country ? memory.country : '');
  const [ zipcode, setZipcode ] = React.useState<string>(memory.zipcode ? memory.zipcode : '');
  // const [ takenDate, setTakenDate ] = React.useState<string>(memory.takenDate ? memory.takenDate.toDate : '');
  // const [ takenMonth, setTakenMonth ] = React.useState<Array<string>>([]);
  // const [ takenYear, setTakenYear ] = React.useState<Array<string>>([]);

  React.useEffect(() => {
      const init = async () => {
          if (user) {
              const userCriteriaDao = new UserCriteriaDao(user.id);
              const data = await userCriteriaDao.getUserCriteriaByUserID();
              setDefaultTags(data.tags);
          }
      }
      init();
  }, [user])

  const handleEdit = async () => {
    await memoryDao.update({
      tags,
      city,
      state,
      neighbourhood,
      country,
      zipcode
    });
    
    handleClose();
  }

  const handleDelete = async () => {
    await memoryDao.delete();

    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Memory</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Feel free to be as descriptive as possible. Common informations have been listed below.
        </DialogContentText>
        <TextField
          onFocus={e => e.target.select()}
          onChange={e => setTitle(e.target.value)}
          margin="dense"
          id="title"
          label="Title"
          fullWidth
          value={title}
        />
        <TextField
          onChange={e => setNeighbourhood(e.target.value)}
          margin="dense"
          id="neighbourhood"
          label="Neighbourhood/Location"
          fullWidth
          value={neighbourhood}
        />
        <TextField
          onChange={e => setCity(e.target.value)}
          margin="dense"
          id="city"
          label="City"
          fullWidth
          value={city}
        />
        <TextField
          onChange={e => setState(e.target.value)}
          margin="dense"
          id="state"
          label="State"
          fullWidth
          value={state}
        />
        <TextField
          onChange={e => setCountry(e.target.value)}
          margin="dense"
          id="country"
          label="Country"
          fullWidth
          value={country}
        />
        <TextField
          onChange={e => setZipcode(e.target.value)}
          margin="dense"
          id="zipcode"
          label="Zip Code"
          fullWidth
          value={zipcode}
        />

    {/* {
      takenDate !== null
      ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
        fullWidth
        margin="normal"
        id="date-picker-dialog"
        label="Date picker dialog"
        format="MM/dd/yyyy"
        value={takenDate}
        onChange={date => setTakenDate(date)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        />
        {
          Object.keys(item).length === 1 ? (
            <KeyboardTimePicker
            fullWidth
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={takenDate}
            onChange={time => setTakenDate(time)}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            />
          ) : <></>
        }
        </MuiPickersUtilsProvider>
      ) : ''
    } */}

    <br />
    <br />
    <Autocomplete
        multiple
        freeSolo
        value={tags}
        onChange={ (e, newValue) => {
            if (tags.length <= 10) setTags([...newValue]);
        }}
        id="collectionsSelect"
        options={ defaultTags.map(t => t) }
        style={{ width: "100%" }}
        renderTags={
            (value, getTagProps) =>
                value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
        }
        renderInput={(params) => <TextField {...params} label="Existing Tags" variant="outlined" />}
    />
    </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="secondary" variant="contained" size="small">
          Delete
        </Button>
        <Button onClick={handleEdit} color="primary" variant="contained" size="small">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditMemory;