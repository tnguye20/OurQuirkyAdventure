import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useFilterValue, useUserValue } from '../../contexts';
import {
  makeStyles,
  Button,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import AppsIcon from '@material-ui/icons/Apps';
import MenuIcon from '@material-ui/icons/Menu';
import FilterIcon from '@material-ui/icons/Filter';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './Header.css';

import { ROUTES } from '../../shared/config';
import { Filter } from '../Filter';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    width: '100%',
    height: '100%',
    display: 'block',
    "&:hover, &:focus": {
      color: 'white',
      textDecoration: 'none',
      backgroundColor: 'lightseagreen'
    },
  },
  button: {
    textDecoration: 'none',
    color: 'white',
    width: '100%',
    height: '100%',
    "&:hover, &:focus": {
      color: 'white',
      textDecoration: 'none',
      backgroundColor: 'lightseagreen'
    },
  },
  paper: {
    color: "white",
    background: "rgba(29, 32, 33, 0.5)"
  }
}));

export const Header = () => {
  const classes = useStyles();
  const {
    filterState,
    openFilter,
    closeFilter,
    filterCriteria,
    resetFilterCriteria,
    saveFilterCriteria,
    isFilterEmpty
  } = useFilterValue()!;
  const location = useLocation();
  const { user } = useUserValue();
  const [ open, setOpen ] = useState(false);

  const MenuList = () => (
    <div className={ classes.list }>
      <List>
        <ListItem button>
          <ListItemIcon><AccountCircleIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary={<h4><i>{user ? user.displayName : ''}</i></h4>} />
        </ListItem>

        <Divider />
        <NavLink className={ classes.link } to={ ROUTES.UPLOAD } activeClassName="navActive" onClick={ e => setOpen(false) }>
          <ListItem button>
            <ListItemIcon><CloudUploadIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Upload" />
          </ListItem>
        </NavLink>

        <Divider />
        <NavLink className={classes.link} to={ROUTES.SLIDE} isActive={(match, location) => location.pathname === ROUTES.SLIDE || location.pathname === ROUTES.ROOT} activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><PhotoAlbumIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Slideshow" />
          </ListItem>
        </NavLink>

        <Divider />
        <NavLink className={ classes.link } to={ ROUTES.GALLERY } activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><AppsIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Gallery" />
          </ListItem>
        </NavLink>

        <Divider />
        <ListItem className={ classes.button } button onClick={() => { setOpen(false); openFilter(); } }>
          <ListItemIcon><FilterIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Filter Memories" />
        </ListItem>
        {
         !isFilterEmpty() ? (
           <ListItem button className="subItem" onClick={ () => {
              setOpen(false);
              resetFilterCriteria();
           } }>
            <ListItemIcon><ClearAllIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Reset Filters" />
          </ListItem>
         ) : ""
        }

        <Divider/>
        {/* <NavLink className={ classes.link } to={ ROUTES.USER_SETTINGS } activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><SettingsIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="User Settings" />
          </ListItem>
        </NavLink> */}

        <Divider/>
        <NavLink className={ classes.link } to={ ROUTES.LOGOUT }>
          <ListItem button>
            <ListItemIcon><ExitToAppIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </NavLink>

        <Divider/>

      </List>
    </div>
  )

  return (
    <div id="header">
      <Button onClick={e => setOpen(true)}>
        <MenuIcon htmlColor={
            location.pathname === ROUTES.SLIDE || location.pathname === ROUTES.ROOT 
            ? 'white'
            : ''
          }/>
      </Button>
      <Drawer open={open} onClose={ e => setOpen(false)} classes={{ paper: classes.paper }}>
        { MenuList() }
      </Drawer>

      {
        filterState ? (
          <Filter filterState={filterState} closeFilter={closeFilter} filterCriteria={filterCriteria} saveFilterCriteria={saveFilterCriteria} />
        ) : ''
      }
    </div>
  );
}
