import * as React from 'react';
import { ActionButton, GetMemoryByUserParams, State, Action, Memory } from '../../interfaces';
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
import { CircularProgress, Dialog } from '@material-ui/core';
import { getDateFromTimestamp } from '../../utils';
import { ActionButtons } from '../ActionButtons';

import EditIcon from '@material-ui/icons/Edit';
import SelectAll from '@material-ui/icons/SelectAll';
import EditMemory from './EditMemory';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'delete': {
      const tmp: Array<Memory> = [];
      state.memories.forEach((m) => {
        if (action.ids.indexOf(m.id!) === -1) tmp.push(m)
      });

      return {...state, checked_memories: {}, memories: tmp, editOpen: false}
    }
    case 'edit_done': {
      console.log(action.updated_content);
      const tmp = [...state.memories];
      for (let i = 0; i < tmp.length; i++) {
        if (state.checked_memories[tmp[i].id!] !== undefined) {
          tmp[i] = {...tmp[i], ...action.updated_content};
        }
      }
      const checked = document.querySelectorAll('.memoryContainer.checked');
      checked.forEach((el) => el.classList.remove('checked'));

      return {...state, checked_memories: {}, memories: tmp, editOpen: false}
    }
    case 'init': {
      return { ...state,  memories: action.memories,  };
    }
    case 'dateUpdate': {
      const sorted = state.memories.sort((a, b) => getDateFromTimestamp(b.takenDate).getUTCDate() - getDateFromTimestamp(a.takenDate).getUTCDate());
      // console.log('sorted', sorted);
      return { ...state, memories: sorted};
    }
    case 'check': {
      return { ...state, checked_memories: {
        ...state.checked_memories,
        [action.memory.id!] : action.memory
      } }
    }
    case 'uncheck': {
      const tmp = { ...state.checked_memories };
      delete tmp[action.memory.id!]
      return { ...state, checked_memories: tmp };
    }
    case 'check_all': {
      const obj = {};
      state.memories.forEach((m) => obj[m.id!] = m);

      return { ...state, checked_memories: obj }
    }
    case 'uncheck_all': {
      return { ...state, checked_memories: {} };
    }
    case 'edit': {
      return {...state, editOpen: true };
    }
    case 'edit_close': {
      return {...state, editOpen: false };
    }
    default: return state;
  }
}

export const Gallery: React.FC = () => {
  const { memories, setMemories } = useMemory(6);
  const { authUser } = useAuthValue();
  const { filterCriteria } = useFilterValue()!;
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [state, dispatch] = React.useReducer(reducer, { memories, checked_memories: {}, editOpen: false });

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

  const handleEdit = () => {
    dispatch({type: 'edit'});
  }
  
  const handleSelectAll = () => {
    const containers = document.querySelectorAll('.memoryContainer');
    const not_checked = document.querySelectorAll('.memoryContainer:not(.checked)');

    if (not_checked.length === containers.length && not_checked.length > 0) {
      containers.forEach((el) => el.classList.add('checked'));
      dispatch({type: 'check_all'});
    }
    else if (not_checked.length === 0) {
      containers.forEach((el) => el.classList.remove('checked'));
      dispatch({type: 'uncheck_all'});
    }
    else {
      const checked = document.querySelectorAll('.memoryContainer.checked');
      checked.forEach((el) => el.classList.remove('checked'));
      containers.forEach((el) => el.classList.add('checked'));
      dispatch({type: 'check_all'});
    }
  }

  const actions: Array<ActionButton> = [
    { 
      icon: <EditIcon />,
      name: 'Edit',
      cb: handleEdit,
      condition: Object.values(state.checked_memories).length > 0
    },
    { 
      icon: <SelectAll />,
      name: 'Toggle All',
      cb: handleSelectAll,
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

      {
        state.memories.length > 0
        ? (
          <EditMemory memories={Object.values(state.checked_memories)} open={state.editOpen} handleClose={() => dispatch({type: 'edit_close'})} dispatch={dispatch}/>
        ) : ''
      }
    </div>
   )
};
