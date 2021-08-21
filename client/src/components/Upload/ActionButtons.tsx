import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SelectAll from '@material-ui/icons/SelectAll';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 380,
      transform: 'translateZ(0px)',
      flexGrow: 1,
      position: 'fixed',
      right: 15,
      bottom: 15
    },
    speedDial: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

export const ActionButtons: React.FC<any> = ({
  canUpload,
  handleUpload,
  handleFileContent,
  handleDelete,
  handleSelectAll
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actions = [
    { icon: <SelectAll />, name: 'Toggle All', cb: handleSelectAll, condition: true},
    { icon: <DeleteIcon />, name: 'Delete', cb: handleDelete, condition: true},
    { icon: <EditIcon />, name: 'Edit', cb: handleFileContent,  condition: true},
    { icon: <CloudUploadIcon />, name: 'Upload', cb: handleUpload, condition: canUpload },
  ];


  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="Upload Action Buttons"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.condition ? action.cb : () => {}}
          />
        ))}
      </SpeedDial>
    </div>
  );
}