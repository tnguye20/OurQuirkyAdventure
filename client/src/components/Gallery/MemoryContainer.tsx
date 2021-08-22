import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import * as React from 'react';
import { Action, Memory } from '../../interfaces';
import { getDateFromTimestamp } from '../../utils';

import './MemoryContainer.css';

const nullString = (str: string | null, hasComma: boolean = false) => {
  return  str === null? '' : (hasComma ? str + ', ' : str);
}

export const MemoryContainer: React.FC<{
  memory: Memory,
  index: number,
  dispatch: React.Dispatch<Action>
}> = ({ memory, dispatch, index }) => {
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
  const [edit, setEdit] = React.useState<boolean>(false);

  const getImage = (url: string) => (
    <img src={url} />
  )
  const getVideo = (url: string) => (
    <video src={url} autoPlay playsInline loop muted />
  )

  const handleOnClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.toggle('checked');
    if (!event.currentTarget.classList.contains('checked')) {
      dispatch({type: 'uncheck', memory})
      setEdit(false);
    }
    else {
      dispatch({type: 'check', memory})
      setEdit(true);
    }
  };

  // const handleCloseEdit = (action: string = '') => {
  //   setOpenEdit(false);

  //   if (action === 'delete') {
  //     dispatch({ type: action, index });
  //   }
  //   else if (action === 'dateUpdate') {
  //     dispatch({ type: action });
  //   }
  // }

  return (
    <>
      <span className="memoryHolder">
        <Card className='memoryContainer' onClick={handleOnClick}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" >
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
          <CardActions disableSpacing >
            {getDateFromTimestamp(memory.takenDate).toDateString()}
          </CardActions>
        </Card>

      </span>
      {/* <EditMemory memory={memory} open={openEdit} handleClose={handleCloseEdit}/> */}
    </>
  )
};