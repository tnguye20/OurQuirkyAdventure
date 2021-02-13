import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import { Backdrop, CircularProgress, Container } from '@material-ui/core';
import { ImagePreview } from './ImagePreview';
import { DetailsModal } from './DetailsModal';
import { ActionButtons } from './ActionButtons';

import './Upload.css';

import { storage } from '../../libs';
import { useAuthValue } from '../../contexts';
import { Category, Extension, Mimetype, Memory } from '../../interfaces/Memory';
import { FileInfo } from '../../interfaces';
import { MemoryDao } from '../../daos';
import { ROUTES } from '../../shared/config';

export const Upload: React.FC = () => {
  const [filesInfo, setFilesInfo] = React.useState<Record<string, FileInfo>>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const files = React.useRef<File[]>();
  const { authUser } = useAuthValue();
  const { uid } = authUser;
  const history = useHistory();

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections
  } = useDropzone({
    accept: 'image/*, video/mp4, video/quicktime',
    maxFiles: 20,
    maxSize: 30000000,
    disabled: isUploading,
    onDropAccepted: (acceptedFiles) => {
      setFilesInfo({});
      files.current = acceptedFiles;
      const info: Record<string, FileInfo> = {};
      files.current.forEach((file) => {
        const { type, name } = file;
        const mimetype = type as keyof typeof Mimetype;
        const mimetypeSplit = mimetype.split("/");
        const category = mimetypeSplit[0] as keyof typeof Category;
        let src = URL.createObjectURL(file);
        info[name] = {
          src,
          title: '',
          category,
          checked: false,
          edited: false,
          tags: []
        }
      })
      setFilesInfo(info);
    }
  });
  
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  React.useEffect(() => () => {
    if (filesInfo) {
      Object.values(filesInfo).forEach((info) => URL.revokeObjectURL(info.src));
    }
  }, [files, filesInfo]);

  const removeCheckmarks = () => {
    const checkedEls = document.querySelectorAll('div.checked');
    if (checkedEls) {
      Array.from(checkedEls).forEach((node) => node.classList.remove('checked'));
    }
  }
  
  const handleCloseModal = () => {
    setShowEditModal(false);
    removeCheckmarks();
    const checkedEls = document.querySelectorAll('div.checked');
    if (checkedEls) {
      Array.from(checkedEls).forEach((node) => node.classList.remove('checked'));
    }
    if (filesInfo) Object.values(filesInfo).forEach((info) => {
      info.checked = false;
      if (info.title === '' && info.tags.length === 0) {
        info.edited = false;
      }
    });
  }
  
  const getCheckedFilesInfo = (fi: Record<string, FileInfo>): Record<string, FileInfo> => {
    if (fi === undefined) return {};
    return Object.keys(fi)
      .reduce((reduced: Record<string, FileInfo>, filename: string) => {
        if (fi[filename].checked) {
          reduced[filename] = fi[filename];
        }
        return reduced;
      }, {} as Record<string, FileInfo>);
  }

  const handleFileContent = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (filesInfo) {
      if (Object.keys(getCheckedFilesInfo(filesInfo)).length > 0) {
        setShowEditModal(true);
      }
    }
  }

  /**
   *  Delete selected resources
   *  Revoke src to prevent memory leak
   *  Remove entries from filesInfo
   *  Remove entries from acceptedFiles
   */
  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (filesInfo) {
      const checkedFilesInfo = getCheckedFilesInfo(filesInfo);
      const tmpFilesInfo = { ...filesInfo };
      const filenames = Object.keys(checkedFilesInfo)
      filenames.forEach((filename) => {
          URL.revokeObjectURL(tmpFilesInfo[filename].src);
          delete tmpFilesInfo[filename];
        });
      
      files.current = acceptedFiles.filter((file) => filenames.indexOf(file.name) === -1);
      setFilesInfo(tmpFilesInfo);
      removeCheckmarks();
    }
  }

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsUploading(true);
    const now = Date.now();

    if (files.current && filesInfo) {
      try { 
        const memoryDao = new MemoryDao();
        const promises = files.current.map(async (file) => {
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
            if (fileInfo.tags.length > 0) memory.tags = fileInfo.tags;
            return memoryDao.addMemory({ ...memory });
          }
          catch (error) {
            console.log(error);
            return Promise.reject();
          }
        });
        
        // Report on failed upload
        const results = await Promise.allSettled(promises);
        history.push(ROUTES.ROOT);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setIsUploading(false);
      }
    }
  }
 
  return (
    <Container id='uploadContainer'>
      <section>
        <div {...getRootProps({ className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
          {
            fileRejectionItems.length > 0 ? (
              <aside>
                    <h4>Rejected files</h4>
                    <ul>{fileRejectionItems}</ul>
              </aside>
            ) : ''
          }
      </section>

      {
        filesInfo ? <ImagePreview filesInfo={filesInfo} setFilesInfo={setFilesInfo}/> : ''
      }

      <br /><br /><br /><br />
      {
        showEditModal ? <DetailsModal open={showEditModal} filesInfo={filesInfo} getCheckedFilesInfo={getCheckedFilesInfo} handleCloseModal={handleCloseModal} isUploading={isUploading} /> : ''
      }
      

      <Backdrop open={isUploading} className='backdrop'>
        <h4><i>Uploading...</i></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <CircularProgress color="inherit" />
      </Backdrop>

      <ActionButtons handleFileContent={handleFileContent} handleDelete={handleDelete} handleUpload={handleUpload} canUpload={acceptedFiles.length > 0}/>
    </Container>
  );
}