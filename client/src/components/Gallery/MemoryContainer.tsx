import * as React from 'react';
import { Category, Memory } from '../../interfaces';
import EditMemory from './EditMemory';

export const MemoryContainer: React.FC<{
  memory: Memory
}> = ({ memory }) => {
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

  const handleCloseEdit = () => {
    setOpenEdit(false);
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