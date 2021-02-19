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
  KeyboardTimePicker,
  DateTimePicker,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { MemoryDao, UserCriteriaDao } from '../../daos';
import { getDateFromTimestamp } from '../../utils';

const EditMemory: React.FC<{
  memory: Memory,
  open: boolean,
  handleClose: (action?: string) => void
}> = ({ memory, open, handleClose }) => {
  const { user } = useUserValue();
  const memoryDao = new MemoryDao(memory.id!);

  const [ tags, setTags ] = React.useState<Array<string>>(memory.tags);
  const [ defaultTags, setDefaultTags ] = React.useState<Array<string>>([]);
  const [ title, setTitle ] = React.useState<string>(memory.title);

  const [ city, setCity ] = React.useState<string | undefined>(memory.city ? memory.city : undefined);
  const [ neighbourhood, setNeighbourhood ] = React.useState<string | undefined>(memory.neighbourhood ? memory.neighbourhood : undefined);
  const [ streetName, setStreetName ] = React.useState<string | undefined>(memory.streetName ? memory.streetName : undefined);
  const [ state, setState ] = React.useState<string | undefined>(memory.state ? memory.state : undefined);
  const [ country, setCountry ] = React.useState<string | undefined>(memory.country ? memory.country : undefined);
  const [ zipcode, setZipcode ] = React.useState<string | undefined>(memory.zipcode ? memory.zipcode : undefined);
  const [ takenDate, setTakenDate ] = React.useState<Date>(getDateFromTimestamp(memory.takenDate));

  React.useEffect(() => {
      const init = async () => {
          if (user) {
              const userCriteriaDao = new UserCriteriaDao(user.id);
              const data = await userCriteriaDao.getUserCriteriaByUserID();
              setDefaultTags(data.tags);
          }
      }
      init();
  }, [user, open])

  const handleEdit = async () => {
    const update: Record<string, any> = {
      tags,
      city,
      state,
      streetName,
      neighbourhood,
      country,
      zipcode,
      takenDate
    };
    if (takenDate) {
      const takenMonth = takenDate.getUTCMonth() + 1;
      const takenYear = takenDate.getUTCFullYear();
      update.takenMonth = takenMonth;
      update.takenYear = takenYear;
    }
    Object.keys(update).forEach((key) => {
      if (!update[key]) {
        delete update[key];
      }
    });

    await memoryDao.update(update);

    handleClose((getDateFromTimestamp(memory.takenDate).toDateString() === takenDate.toDateString()) ? '' : 'dateUpdate');
  }

  const handleDelete = async () => {
    await memoryDao.delete();

    handleClose('delete');
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setTakenDate(date);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Memory <i>{memory.name}</i></DialogTitle>
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
          onChange={e => setStreetName(e.target.value)}
          margin="dense"
          id="streetName"
          label="Street Name"
          fullWidth
          value={streetName}
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

    {
      takenDate !== undefined
      ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          fullWidth
          margin="normal"
          id="date-time-picker-dialog"
          label="Date Time picker dialog"
          value={takenDate}
          onChange={handleDateChange}
          format="yyyy/MM/dd hh:mm a"
          />
        </MuiPickersUtilsProvider>
      ) : ''
    }

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