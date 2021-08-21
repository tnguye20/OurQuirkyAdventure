import * as React from 'react';
import { ActionButton, GetMemoryByUserParams, State, Action } from '../../interfaces';
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
import { ActionButtons } from '../ActionButtons';

import EditIcon from '@material-ui/icons/Edit';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'delete': {
      const tmp = state.memories;
      tmp.splice(action.index, 1);
      return { ...state, memories: tmp};
      // return { memories: tmp.sort((a, b) => b.takenDate.getTime() - a.takenDate.getTime())};
    }
    case 'init': {
      return { ...state,  memories: action.memories };
    }
    case 'dateUpdate': {
      const sorted = state.memories.sort((a, b) => getDateFromTimestamp(b.takenDate).getUTCDate() - getDateFromTimestamp(a.takenDate).getUTCDate());
      console.log('sorted', sorted);
      return { ...state, memories: sorted};
    }
    case 'check': {
      console.log({ ...state, checked_memories: {
        ...state.checked_memories,
        [action.memory.id!] : action.memory
      } });
      return { ...state, checked_memories: {
        ...state.checked_memories,
        [action.memory.id!] : action.memory
      } }
    }
    case 'uncheck': {
      const tmp = { ...state.checked_memories };
      delete tmp[action.memory.id!]
      console.log({ ...state, checked_memories: tmp });
      return { ...state, checked_memories: tmp };
    }
    default: return state;
  }
}

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(2);
  const { authUser } = useAuthValue();
  const { filterCriteria } = useFilterValue()!;
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [state, dispatch] = React.useReducer(reducer, { memories, checked_memories: {} });

  const gridRef = React.useRef<{updateLayout: () => void}>();
  const resetVideoSize = React.useCallback(() => {
    console.log(gridRef.current);
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
        limit: 6,
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

  const actions: Array<ActionButton> = [
    { 
      icon: <EditIcon />,
      name: 'Edit',
      cb: () => {},
      condition: true
    }
  ]

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
                        columnWidth={size ? (size.width! <= 375 ? '100%' : '50%') : '50%'}
                        itemComponent='div'
                        gutterHeight={9}
                        gutterWidth={9}
                        monitorImagesLoaded={true}
                        gridRef={grid => {gridRef.current = grid}}
                      >
                      {
                          state.memories.map((m, index) => <MemoryContainer 
                            key={m.id} 
                            index={index}
                            memory={m} 
                            dispatch={dispatch}
                          />)
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


      <ActionButtons 
        label="Gallery Edit"
        actions={actions}
      />
    </div>
   )
};
