import React, { useState, useEffect } from 'react';
import { useUserValue } from '../../contexts';
import { UserCriteriaDao } from '../../daos';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip,
  Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import './Filter.css';
import { FilterCriteria } from '../../interfaces';

export const Filter: React.FC<{
    filterState: boolean,
    closeFilter: () => void,
    saveFilterCriteria: (f: FilterCriteria) => void,
    filterCriteria: FilterCriteria,
}> = ({
    filterState,
    closeFilter,
    filterCriteria,
    saveFilterCriteria
}) => {
    const { user } = useUserValue();

    const [ tags, setTags ] = useState<Array<string>>([]);
    const [ defaultTags, setDefaultTags ] = useState<Array<string>>([]);
    const [ cities, setCities ] = useState<Array<string>>([]);
    const [ defaultCities, setDefaultCities ] = useState<Array<string>>([]);
    const [ states, setStates ] = useState<Array<string>>([]);
    const [ defaultStates, setDefaultStates ] = useState<Array<string>>([]);
    const [ takenMonths, setTakenMonths ] = useState<Array<string>>([]);
    const [ defaultTakenMonths, setDefaultTakenMonths ] = useState<Array<string>>([]);
    const [ takenYears, setTakenYears ] = useState<Array<string>>([]);
    const [ defaultTakenYears, setDefaultTakenYears ] = useState<Array<string>>([]);
    const [ category, setCategory ] = useState<string>();

    useEffect(() => {
        const init = async () => {
            if (user) {
                const userCriteriaDao = new UserCriteriaDao(user.id);
                const data = await userCriteriaDao.getUserCriteriaByUserID();
                setDefaultTags(data.tags);
                setDefaultCities(data.cities);
                setDefaultStates(data.states);
                setDefaultTakenMonths(data.takenMonths);
                setDefaultTakenYears(data.takenYears);
            }
        }
        init();

        //Load Current Filter if there is any
        if (filterCriteria.tags.length > 0) setTags(filterCriteria.tags);
        if (filterCriteria.cities.length > 0) setCities(filterCriteria.cities);
        if (filterCriteria.states.length > 0) setStates(filterCriteria.states);
        if (filterCriteria.takenMonths.length > 0) setTakenMonths(filterCriteria.takenMonths);
        if (filterCriteria.takenYears.length > 0) setTakenYears(filterCriteria.takenYears);
        if (filterCriteria.categories.length > 0) setCategory(filterCriteria.categories[0]);
    }, [user])

    const aggregateFilters = () => {
        const filter = new FilterCriteria();
        if (tags.length > 0){
            filter.tags = tags;
        }
        if (cities.length > 0){
            filter.cities = cities;
        }
        if (states.length > 0){
            filter.states =states;
        }
        if (takenMonths.length > 0){
            filter.takenMonths = takenMonths;
        }
        if (takenYears.length > 0){
            filter.takenYears = takenYears;
        }
        if (category) {
            filter.categories = [category];
        }
        saveFilterCriteria(filter);
        closeFilter();
    }

    return(
    <Dialog open={filterState} onClose={closeFilter} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Filter</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Filter your memories based on Tags
            </DialogContentText>

            <Autocomplete
                multiple
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
            <br />
            <Grid container spacing={2} direction="row">
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={cities}
                    onChange={ (e, newValue) => {
                        if (cities.length <= 10) setCities([...newValue]);
                    }}
                    id="citiesSelect"
                    options={ defaultCities.map(c => c) }
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            cities.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Cities" variant="outlined" />}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                  <Autocomplete
                      multiple
                      value={states}
                      onChange={ (e, newValue) => {
                          if (states.length <= 10) setStates([...newValue]);
                      }}
                      id="statesSelect"
                      options={ defaultStates.map(s => s) }
                      style={{ width: "100%" }}
                      renderTags={
                          (value, getTagProps) =>
                              states.map((option, index) => (
                              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                      }
                      renderInput={(params) => <TextField {...params} label="States" variant="outlined" />}
                  />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} direction="row">
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={takenMonths}
                    onChange={ (e, newValue) => {
                        if (takenMonths.length <= 10) setTakenMonths([...newValue]);
                    }}
                    id="takenMonthsSelect"
                    options={ defaultTakenMonths.map(s => s) }
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            takenMonths.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Month(s) Taken" variant="outlined" />}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={takenYears}
                    onChange={ (e, newValue) => {
                        if (takenYears.length <= 10) setTakenYears([...newValue]);
                    }}
                    id="takenYearsSelect"
                    options={ defaultTakenYears.map(s => s) }
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            takenYears.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Year(s) Taken" variant="outlined" />}
                />
              </Grid>
          </Grid>
          <br />
           <FormControl variant="outlined" style={{ width: "100%" }}>
							<InputLabel htmlFor="outlined-mimetype-native-simple">Type</InputLabel>
							<Select
								value={category}
                                onChange={ e => setCategory(e.target.value as string) }
								label="type"
								inputProps={{
									name: 'category',
									id: 'outlined-mimetype-native-simple',
								}}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="image">Image</MenuItem>
								<MenuItem value="video">Video</MenuItem>
							</Select>
					</FormControl>
          <br />

        </DialogContent>
        <DialogActions>
        <Button onClick={closeFilter} color="secondary" variant="outlined" size="small">
            Cancel
        </Button>
        <Button
            disabled={
                tags.length === 0  &&
                cities.length === 0 &&
                states.length === 0 &&
                takenYears.length === 0 &&
                takenMonths.length === 0
            }
            onClick={aggregateFilters}
            color="primary"
            variant="outlined"
            size="small"
        >
            Filter Memories
        </Button>
        </DialogActions>
    </Dialog>
    )
}
