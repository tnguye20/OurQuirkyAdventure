import * as React from 'react';
import { useUserValue } from '../../contexts';
import { UserDao } from '../../daos';

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
  getCheckedFilesInfo,
  filesInfo,
  isUploading
}) => {
  const { user } = useUserValue();
  const [ title, setTitle ] = React.useState<string>('');
  const [ collections, setCollections ] = React.useState<string[]>([]);
  const [ checkedFilesInfo, setCheckedFilesInfo ] = React.useState<Record<string, FileInfo> | undefined>();

  React.useEffect(() => {
    const cfi: Record<string, FileInfo> = getCheckedFilesInfo(filesInfo);
    setCheckedFilesInfo(cfi);
    if (cfi) {
      const checkedItems = Object.values(cfi) as Array<FileInfo>;
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
    }
  }, []);

  const addToCollection = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    
    // Add new tags to user's collections if possible
    const totalTags = Array.from(new Set([...user!.collections, ...collections]));
    const userDao = new UserDao(user!.id);
    await userDao.updateUser('collections', totalTags);

    Object.keys(checkedFilesInfo!).forEach((filename) => {
      filesInfo[filename].title = title; filesInfo[filename].edited = true;
      filesInfo[filename].tags = collections; filesInfo[filename].edited = true;
    });

    handleCloseModal();
  }

  return(
    <Dialog open={open} onClose={handleCloseModal} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Tagging</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Choose from existing tags or create new ones. Limit to 10 tags per item.
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
                    if (newValue.length <= 10) setCollections([...newValue]);
                }}
                id="collectionsSelect"
                options={user ? user.collections.map( item => item ) : []}
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
        <Button disabled={isUploading} onClick={addToCollection} color="primary" variant="outlined" size="small">
            Add Details
        </Button>
        </DialogActions>
    </Dialog>
  )

}