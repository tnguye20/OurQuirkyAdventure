import * as React from 'react';
import { Action, Memory } from '../../interfaces';
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
  // KeyboardTimePicker,
  // DateTimePicker,
  // KeyboardDateTimePicker
} from '@material-ui/pickers';
import { MemoryDao, UserCriteriaDao } from '../../daos';
import { ArrayIsEqual, getDateFromTimestamp } from '../../utils';

const compareDates = (t1: Date, t2: Date): boolean => {
  let d1 = getDateFromTimestamp(t1);
  let d2 = getDateFromTimestamp(t2);

  return d1.getUTCDay() === d2.getUTCDay() && d1.getUTCMonth() === d1.getUTCMonth() && d1.getUTCFullYear() === d2.getUTCFullYear();
}

const EditMemory: React.FC<{
  memories: Array<Memory>,
  open: boolean,
  handleClose: (action?: string) => void,
  dispatch: React.Dispatch<Action>
}> = ({ open, memories, handleClose, dispatch }) => {
  const { user } = useUserValue();

  const [ tags, setTags ] = React.useState<Array<string>>([]);
  const [ defaultTags, setDefaultTags ] = React.useState<Array<string>>([]);
  const [ title, setTitle ] = React.useState<string>('');

  const [ city, setCity ] = React.useState<string | undefined>('');
  const [ neighbourhood, setNeighbourhood ] = React.useState<string | undefined>('');
  const [ streetName, setStreetName ] = React.useState<string | undefined>('');
  const [ state, setState ] = React.useState<string | undefined>('');
  const [ country, setCountry ] = React.useState<string | undefined>('');
  const [ zipcode, setZipcode ] = React.useState<string | undefined>('');
  const [ takenDate, setTakenDate ] = React.useState<Date | undefined>((undefined));

  const reduceMemories = (ms: Array<Memory>): Memory => {
    return ms.reduce((acc: Memory, curr: Memory): Memory => {
      const tmp = { ...acc };
      tmp.title = acc.title === curr.title ? acc.title : '';
      tmp.city = acc.city === curr.city ? acc.city : '';
      tmp.neighbourhood = acc.neighbourhood === curr.neighbourhood ? acc.neighbourhood : '';
      tmp.streetName = acc.streetName === curr.streetName ? acc.streetName : '';
      tmp.state = acc.state === curr.state ? acc.state : '';
      tmp.zipcode = acc.zipcode === curr.zipcode ? acc.zipcode : '';
      tmp.country = acc.country === curr.country ? acc.country : '';
      tmp.tags = ArrayIsEqual(acc.tags, curr.tags) ? acc.tags : [];
      tmp.takenDate = compareDates(acc.takenDate, curr.takenDate) ? acc.takenDate : new Date();

      return tmp;
    });
  }

  React.useEffect(() => {
      const init = async () => {
          if (user) {
              const userCriteriaDao = new UserCriteriaDao(user.id);
              const data = await userCriteriaDao.getUserCriteriaByUserID();
              setDefaultTags(data.tags);
          }
          if (memories.length > 0) {
            const rm = reduceMemories(memories);
            setTitle(rm.title!);
            setCity(rm.city!);
            setNeighbourhood(rm.neighbourhood!);
            setStreetName(rm.streetName!);
            setState(rm.state!);
            setCountry(rm.country!);
            setZipcode(rm.zipcode!);
            setTags(rm.tags!);
            setTakenDate(getDateFromTimestamp(rm.takenDate!));
          }
      }
      init();

      return () => {
        setTitle('');
        setCity('');
        setNeighbourhood('');
        setStreetName('');
        setState('');
        setCountry('');
        setZipcode('');
        setTags([]);
      }
  }, [user, open])

  const handleEdit = async () => {
    const update: Record<string, any> = {
      title,
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
      const takenMonth = (takenDate.getUTCMonth() + 1).toString();
      const takenYear = (takenDate.getUTCFullYear()).toString();
      update.takenMonth = takenMonth;
      update.takenYear = takenYear;
    }
    Object.keys(update).forEach((key) => {
      if (!update[key]) {
        delete update[key];
      }
    });

    for (let i = 0; i < memories.length; i++) {
      const memory = memories[i];
      const dao = new MemoryDao(memory.id!);
      await dao.update(update);
    }

    dispatch({type: 'edit_done', updated_content: update});
  }

  const handleDelete = async () => {
    const ids: Array<string> = [];
    for (let i = 0; i < memories.length; i++) {
      const memory = memories[i];
      ids.push(memory.id!);
      const dao = new MemoryDao(memory.id!);
      await dao.delete();
    }

    dispatch({type: 'delete', ids});
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setTakenDate(date);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} aria-labelledby="form-dialog-title">
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
        <KeyboardDatePicker
          fullWidth
          margin="normal"
          id="date-time-picker-dialog"
          label="Date Time picker dialog"
          value={takenDate}
          onChange={handleDateChange}
          // format="yyyy/MM/dd hh:mm a"
          format="yyyy/MM/dd"
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