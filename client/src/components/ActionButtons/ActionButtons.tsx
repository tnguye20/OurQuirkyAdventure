import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { ActionButton } from '../../interfaces';

interface ActionButtonProps {
  label: string,
  actions: Array<ActionButton>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 9999,
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

export const ActionButtons: React.FC<ActionButtonProps> = ({
  actions,
  label
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

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel={label}
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