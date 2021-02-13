import * as React from 'react';
import { Memory, Category } from '../../interfaces';
import { useMemory } from '../../hooks';
import StackGrid from "react-stack-grid";
import './Gallery.css'
import Container from '@material-ui/core/Container';

export const Gallery: React.FC = () => {
  const { memories } = useMemory(7);
  return (
    <Container id='galleryContainer'>
      <StackGrid
        columnWidth='30%'
        itemComponent='div'
        gutterHeight={9}
        monitorImagesLoaded={true}
      >
        {
          memories.length > 0
            ? memories.map((m) => <MemoryContainer memory={m}/>)
            : '' 
        }
      </StackGrid>
    </Container>
  )
};

const MemoryContainer: React.FC<any> = (prop) => {
  const {
    category,
    url,
    title
  } = prop.memory as Memory;
  const c = category as string;

  const getImage = (url: string) => (
    <img src={url} />
  )
  const getVideo = (url: string) => (
    <video src={url} autoPlay controls playsInline loop muted/>
  )

  return (
    <>
      {
        category === Category.image
        ? getImage(url)
        : getVideo(url)
      }
    </>
  )
};