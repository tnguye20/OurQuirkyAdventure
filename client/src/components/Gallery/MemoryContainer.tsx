import * as React from 'react';
import { Category, Memory } from '../../interfaces';

export const MemoryContainer: React.FC<any> = (prop) => {
  const {
    category,
    url,
  } = prop.memory as Memory;
  const c = category as string;

  const getImage = (url: string) => (
    <img src={url} />
  )
  const getVideo = (url: string) => (
    <video src={url} controls playsInline loop muted/>
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