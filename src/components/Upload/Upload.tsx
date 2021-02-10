import * as React from 'react';
import Button from '@material-ui/core/Button';

import { storage } from '../../lib';
import { useAuthValue } from '../../contexts';
import { Category, Extension, Mimetype, Memory } from '../../interfaces/Memory';
import { FileInfo } from '../../interfaces';
import { MemoryDao } from '../../daos';
import { 
  getImageSrc, getVideoSource
} from '../../utils';
import { ImagePreview } from './ImagePreview';
import { DetailsModal } from './DetailsModal';

export const Upload: React.FC = () => {
  const [filesInfo, setFilesInfo] = React.useState<Record<string, FileInfo>>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [checkedFiles, setCheckedFiles] = React.useState<Record<string, FileInfo>>();

  const files = React.useRef<FileList>();
  const { authUser } = useAuthValue();
  const { uid } = authUser;

  React.useEffect(() => () => {
    if (filesInfo) {
      Object.values(filesInfo).forEach((info) => URL.revokeObjectURL(info.src));
    }
  }, [files, filesInfo]);
  
  const handleCloseModal = () => {
    setShowEditModal(false);

    Array.from(document.querySelectorAll('div.checked')).forEach((node) => node.classList.remove('checked'));
    Object.values(filesInfo!).forEach((info) => info.checked = false);
    setCheckedFiles({});
  }
  
  const reset = () => {
    setCheckedFiles({});
    setFilesInfo({});
  }

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    reset();

    if (event.target.files) {
      files.current = event.target.files;
      const info: Record<string, FileInfo> = {};
      for (const file of Array.from(files.current)) {
        const { type, name } = file;

        const mimetype = type as keyof typeof Mimetype;
        const mimetypeSplit = mimetype.split("/");
        const category = mimetypeSplit[0] as keyof typeof Category;
        let src: string;
        if (category === Category.video) {
          src = await getVideoSource(file);
        }
        else {
          src = await getVideoSource(file);
        }
        info[name] = {
          src,
          title: '',
          category,
          checked: false,
          tags: []
        }
      }
      setFilesInfo(info);
    }
  }

 
  const handleFileContent = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (filesInfo) {
      const checkedItems = Object.keys(filesInfo)
        .reduce((reduced: Record<string, FileInfo>, filename: string) => {
          if (filesInfo[filename].checked) {
            reduced[filename] = filesInfo[filename];
          }
          return reduced;
        }, {} as Record<string, FileInfo>);
      
      if (checkedFiles) {
        setCheckedFiles(checkedItems);
        setShowEditModal(true);
      }
    }
  }

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsUploading(true);
    const now = Date.now();

    if (files.current && filesInfo) {
      const memoryDao = new MemoryDao();
      const promises = Array.from(files.current).map( async (file) => {
        try {
          const fileInfo = filesInfo[file.name];
          const { name, type, size } = file;

          const mimetype = type as keyof typeof Mimetype;
          const mimetypeSplit = mimetype.split("/");
          const category = mimetypeSplit[0] as keyof typeof Category;
          const extension = mimetypeSplit[1].toUpperCase() as keyof typeof Extension;

          const nameOnly = name.split(".")[0];
          const newName = `${nameOnly}_${now}.${extension}`;
          const fullPath = `${uid}/${category}/${newName}`;
          
          const uploadTaskSnapshot = await storage.child(fullPath).put(file);
          const url = await uploadTaskSnapshot.ref.getDownloadURL();

          const memory = new Memory(name, size, uid!, category, extension, mimetype);
          memory.url = url;
          memory.name = newName;
          if (fileInfo.title !== '') memory.title = fileInfo.title;
          return memoryDao.addMemory({ ...memory });
        }
        catch (error) {
          console.log(error);
          return Promise.reject();
        }
      });
      
      const results = await Promise.allSettled(promises);
      // Report on failed upload
    }
  }
 
  return (
    <div>
      <input type='file' multiple name='uploadInput[]' onChange={handleOnChange}/>
      <Button variant='contained' color='secondary' onClick={handleFileContent} >Handle File Content</Button>
      <Button variant='contained' color='primary' onClick={handleUpload}>Upload Files</Button>
      {
        filesInfo ? <ImagePreview filesInfo={filesInfo} setFilesInfo={setFilesInfo}/> : ''
      }
      {
        checkedFiles ? <DetailsModal open={showEditModal} filesInfo={filesInfo} checkedFiles={checkedFiles} handleCloseModal={handleCloseModal} isUploading={isUploading} /> : ''
      }
    </div>
  );
}