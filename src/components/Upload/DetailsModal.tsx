import * as React from 'react';
import { useUserValue } from '../../contexts';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FileInfo } from '../../interfaces';
import { ArrayIsEqual } from '../../utils';

export const DetailsModal: React.FC<any> = ({
  open,
  handleCloseModal,
  filesInfo,
  checkedFiles,
  isUploading
}) => {
  const { user } = useUserValue();
  const [ title, setTitle ] = React.useState<string>('');
  const [ collections, setCollections ] = React.useState<string[]>([]);

  React.useEffect(() => {
    const checkedItems = Object.values(checkedFiles) as Array<FileInfo>;
    if (checkedItems.length > 0) {
      const reduced = checkedItems.reduce((prev: FileInfo, curr: FileInfo) => {
          const cloned = { ...prev };
          if (cloned.title !== curr.title) {
            cloned.title = '';
          }
          if (!ArrayIsEqual(cloned.tags, curr.tags)) {
            cloned.tags = [];
          }
          return cloned;
        });

      setTitle(reduced.title);
      setCollections(reduced.tags);
    }
  }, [checkedFiles]);

  const addToCollection = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    Object.keys(checkedFiles).forEach((filename) => {
      if (title !== '') filesInfo[filename].title = title;
      if (collections.length > 0) filesInfo[filename].tags = collections;
    });

    handleCloseModal();
  }

  return(
    <Dialog open={open} onClose={handleCloseModal} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Tagging</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Choose from existing collections or create new ones
            </DialogContentText>

            <TextField
              autoFocus
              onChange={e => setTitle(e.target.value)}
              margin="dense"
              id="title"
              label="Title"
              fullWidth
              value={title}
            />
            <br />
            <br />
            <Autocomplete
                multiple
                freeSolo
                value={collections}
                onChange={ (e, newValue) => {
                    setCollections([...newValue]);
                }}
                id="collectionsSelect"
                options={user!.collections.map( item => item )}
                style={{ width: "100%" }}
                renderTags={
                    (value, getTagProps) =>
                        value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Existing Collections"  />}
            />
        </DialogContent>
        <DialogActions>
        <Button disabled={isUploading} onClick={handleCloseModal} color="secondary" variant="outlined" size="small">
            Cancel
        </Button>
        <Button disabled={isUploading || (title.length === 0 && collections.length === 0)} onClick={addToCollection} color="primary" variant="outlined" size="small">
            Add Details
        </Button>
        </DialogActions>
    </Dialog>
  )

}