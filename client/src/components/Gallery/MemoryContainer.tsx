import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import * as React from 'react';
import { Action, Memory } from '../../interfaces';
import EditMemory from './EditMemory';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getDateFromTimestamp } from '../../utils';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: 'black',
    color: 'white'
  },
  avatar: {
    backgroundColor: 'black'
  },
}));

const nullString = (str: string | null, hasComma: boolean = false) => {
  return str === null ? '' : (hasComma ? str + ', ' : str);
}

export const MemoryContainer: React.FC<{
  memory: Memory,
  index: number,
  dispatch: React.Dispatch<Action>
}> = ({ memory, dispatch, index }) => {
  const classes = useStyles();

  const {
    category,
    url,
    title,
    city,
    state,
    neighbourhood,
    streetName,
    takenDate,
  } = memory;
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);

  const getImage = (url: string) => (
    <img src={url} />
  )
  const getVideo = (url: string) => (
    <video src={url} autoPlay playsInline loop muted />
  )

  const handleOnClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setOpenEdit(true);
  };

  const handleCloseEdit = (action: string = '') => {
    setOpenEdit(false);

    if (action === 'delete') {
      dispatch({ type: action, index });
    }
    else if (action === 'dateUpdate') {
      dispatch({ type: action });
    }
  }

  return (
    <>
      <span onClick={handleOnClick}>
        {/* <p>{title}</p>
        <p>
          {
            !city
            ? state
            : !neighbourhood
            ? `${city}, ${state}`
            : `${neighbourhood} ${city}, ${state}`
          }
        </p>
        {
          category === Category.image
          ? getImage(url)
          : getVideo(url)
        } */}
        <Card>
          <CardHeader
            className={classes.header}
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                💕
              </Avatar>
            }
            title={ title }
            subheader={
              `
                ${nullString(neighbourhood)} 
                ${nullString(streetName, true)}
                ${nullString(city, true)}
                ${nullString(state)}
              `
            }
          />
          <CardMedia
            component= { category === "image" ? "img" : category }
            alt=""
            src={url}
            title=""
            controls
            // autoPlay
            playsInline
            // muted
            loop
          />
          <CardActions disableSpacing className={classes.header}>
            {getDateFromTimestamp(memory.takenDate).toDateString()}
          </CardActions>
        </Card>

      </span>
      <EditMemory memory={memory} open={openEdit} handleClose={handleCloseEdit}/>
    </>
  )
};