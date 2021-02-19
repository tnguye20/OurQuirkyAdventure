import * as React from 'react';
import { Action, GetMemoryByUserParams, Memory, State } from '../../interfaces';
import { useMemory } from '../../hooks';
import { useAuthValue, useFilterValue } from '../../contexts';
import StackGrid from "react-stack-grid";
import './Gallery.css'
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getMemoryByUser } from '../../api';
import { SizeMe } from 'react-sizeme';
import { MemoryContainer } from './MemoryContainer';
import { LoadMoreButton } from './LoadMoreButton';
import { NoSlide } from '../NoSlide';
import { CircularProgress } from '@material-ui/core';
import { getDateFromTimestamp } from '../../utils';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'delete': {
      const tmp = state.memories;
      tmp.splice(action.index, 1);
      return { memories: tmp };
      // return { memories: tmp.sort((a, b) => b.takenDate.getTime() - a.takenDate.getTime())};
    }
    case 'init': {
      state.memories = action.memories;
      return { memories: action.memories};
    }
    case 'dateUpdate': {
      const sorted = state.memories.sort((a, b) => getDateFromTimestamp(b.takenDate).getUTCDate() - getDateFromTimestamp(a.takenDate).getUTCDate());
      console.log('sorted', sorted);
      return { memories: sorted};
    }
    default: return state;
  }
}

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(10);
  const [state, dispatch] = React.useReducer(reducer, { memories });
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
    dispatch({ type: 'init', memories });
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
   const lastMemory = state.memories[state.memories.length - 1];
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
          state.memories.length > 0
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
                          state.memories.map((m, index) => <MemoryContainer key={m.id} index={index} memory={m} dispatch={dispatch} />)
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