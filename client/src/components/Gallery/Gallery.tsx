import * as React from 'react';
import { GetMemoryByUserParams } from '../../interfaces';
import { useMemory } from '../../hooks';
import { useAuthValue, useFilterValue } from '../../contexts';
import StackGrid from "react-stack-grid";
import './Gallery.css'
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getMemoryByUser } from '../../api';
import { SizeMe } from 'react-sizeme';
import { MemoryContainer } from './MemoryContainer';
import { LoadMoreButton } from './LoadMoreButton';
import { NoSlide } from '../NoSlide';
import { CircularProgress } from '@material-ui/core';

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(10);
  const { authUser } = useAuthValue();
  const { filterCriteria } = useFilterValue()!;
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
 
  const gridRef = React.useRef<{updateLayout: () => void}>();
  const resetVideoSize = React.useCallback(() => {
    if (gridRef.current) {
      gridRef.current.updateLayout();
    }
  }, []);

  React.useEffect(() => {
    setHasMore(true);
    if (gridRef.current) {
      let videos = document.querySelectorAll('video');
      if (videos) {
        videos.forEach((el, index) => el.addEventListener('loadeddata', resetVideoSize));

        return () => {
          videos.forEach((el, index) => el.removeEventListener('loadeddata', resetVideoSize));
        }
      }
    }
  }, [memories]);

  const loadMore = async () => {
   const lastMemory = memories[memories.length - 1];
    if (lastMemory && hasMore) {
      const params: GetMemoryByUserParams = {
        idToken: authUser.idToken!,
        filterCriteria,
        limit: 10,
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
    setOpenSnackbar(true);
    loadMore();
  };

  useBottomScrollListener(handleOnDocumentBottom);

  return (
    <div id='galleryContainer'>
      <Container>
        {
          memories.length > 0
            ? (
              <>
                <SizeMe>
                  {
                    ({ size }) => (
                      <StackGrid
                        columnWidth={size ? (size.width! <= 375 ? '100%' : '33.33%') : '33.33%'}
                        itemComponent='div'
                        gutterHeight={9}
                        monitorImagesLoaded={true}
                        gridRef={grid => gridRef.current = grid}
                      >
                      {
                          memories.map((m) => <MemoryContainer key={m.id} memory={m}/>)
                      }
                      </StackGrid>
                    )
                  }
                </SizeMe>
                <LoadMoreButton hasMore={hasMore} loadMore={loadMore}/>
              </>
            )
            : <NoSlide dark={true}/> 
        }
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={() => setOpenSnackbar(false)}>
          <CircularProgress size='3rem'/>
      </Snackbar>
    </div>
   )
};