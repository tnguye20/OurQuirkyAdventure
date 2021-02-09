import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { FileInfo } from '../../interfaces';

import './ImagePreview.css';
import { CheckMark } from './CheckMark';

export const ImagePreview: React.FC<any> = (props) => {
  const filesInfo: Record<string, FileInfo> = props.filesInfo;
  const setFilesInfo: React.Dispatch<React.SetStateAction<Record<string, FileInfo>>> = props.setFilesInfo;

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.toggle('checked');
    const filename = event.currentTarget.dataset.filename;
    // const tmp = { ...filesInfo };
    if (filename) {
      // tmp[filename].checked = !filesInfo[filename].checked;
      filesInfo[filename].checked = !filesInfo[filename].checked;
    }
    // setFilesInfo(tmp);
  }

  return (
      <Container maxWidth="lg">
        <Grid container spacing={1} direction="row">
          {
            Object.keys(filesInfo).map( (filename, index) => {
              const { src } = filesInfo[filename];
              return (
                <Grid key={index} item md={4} sm={12} xs={12} >
                  <Card className='fileContainer' onClick={handleOnClick} data-filename={filename}>
                    <CheckMark />
                    <CardActionArea>
                      <CardMedia
                        component='img'
                        src={src}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            })
          }

        </Grid>
      </Container>
  ) 
};