import * as React from 'react';
import { Action, Category, Memory } from '../../interfaces';
import EditMemory from './EditMemory';

export const MemoryContainer: React.FC<{
  memory: Memory,
  index: number,
  dispatch: React.Dispatch<Action>
}> = ({ memory, dispatch, index }) => {
  const {
    category,
    url,
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
        {
          category === Category.image
          ? getImage(url)
          : getVideo(url)
        }
      </span>
      <EditMemory memory={memory} open={openEdit} handleClose={handleCloseEdit}/>
    </>
  )
};