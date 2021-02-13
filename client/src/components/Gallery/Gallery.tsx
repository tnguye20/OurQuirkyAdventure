import * as React from 'react';
import { Memory, Category, GetMemoryByUserParams } from '../../interfaces';
import { useMemory } from '../../hooks';
import { useAuthValue, useFilterValue } from '../../contexts';
import StackGrid from "react-stack-grid";
import './Gallery.css'
import Container from '@material-ui/core/Container';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getMemoryByUser } from '../../api';
import { MemoryDao } from '../../daos';

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(7);
  const { authUser } = useAuthValue();
  const { filterCriteria } = useFilterValue()!;
  const hasMore = React.useRef<boolean>(true);

  const handleOnDocumentBottom = async () => {
    const lastMemory = memories[memories.length - 1];
    if (lastMemory && hasMore.current) {
      const params: GetMemoryByUserParams = {
        idToken: authUser.idToken!,
        filterCriteria,
        limit: 7,
      }
      params.startAfter = { id: lastMemory.id };
      const data = await getMemoryByUser(params);
      if (data.length === 0) {
        hasMore.current = true;
        return;
      }

      setMemories([...memories, ...data]);
    }
  };

  useBottomScrollListener(handleOnDocumentBottom);

  return (
    <div id='galleryContainer'>
      <Container>
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
    </div>
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