import Button from '@material-ui/core/Button';
import * as React from 'react';
import './LoadMoreButton.css';

export const LoadMoreButton: React.FC<{
  hasMore: boolean,
  loadMore: () => any
}> = ({
  hasMore,
  loadMore
}) => {
  return (
    <div id='LoadMoreButtonContainer'>
      {
        hasMore
        ? (
          <Button variant='outlined' color='primary' onClick={loadMore}>Load More</Button>
        ) : ''
      }
    </div>
  );
};