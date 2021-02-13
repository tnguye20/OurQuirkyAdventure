import * as React from 'react';
import { GetMemoryByUserParams } from '../../interfaces';
import { useMemory } from '../../hooks';
import { useAuthValue, useFilterValue } from '../../contexts';
import StackGrid from "react-stack-grid";
import './Gallery.css'
import Container from '@material-ui/core/Container';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getMemoryByUser } from '../../api';
import { SizeMe } from 'react-sizeme';
import { MemoryContainer } from './MemoryContainer';
import { LoadMoreButton } from './LoadMoreButton';

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(10);
  const { authUser } = useAuthValue();
  const { filterCriteria } = useFilterValue()!;
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const loadMore = async () => {
   const lastMemory = memories[memories.length - 1];
    if (lastMemory && hasMore) {
      const params: GetMemoryByUserParams = {
        idToken: authUser.idToken!,
        filterCriteria,
        limit: 7,
      }
      params.startAfter = { id: lastMemory.id };
      const data = await getMemoryByUser(params);
      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setMemories([...memories, ...data]);
    }
  }

  const handleOnDocumentBottom = () => {
    loadMore();
  };

  useBottomScrollListener(handleOnDocumentBottom);

  return (
    <div id='galleryContainer'>
      <Container>
        <SizeMe>
          {
            ({ size }) => (
              <StackGrid
                columnWidth={size ? (size.width! <= 375 ? '100%' : '33.33%') : '33.33%'}
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
            )
          }
        </SizeMe>
        <LoadMoreButton hasMore={hasMore} loadMore={loadMore}/>
      </Container>
    </div>
   )
};