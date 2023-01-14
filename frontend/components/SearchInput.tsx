import { useState, MouseEvent } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { listTagsApi } from '../api/question'
import styles from '../styles/SearchInput.module.scss'

export default function SearchInput() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tags, setTags] = useState<any[]>([])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    listTags()
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const listTags = async () => {
    if (tags.length) return;
    const res = await listTagsApi()
    if (Array.isArray(res?.data?.tags)) {
      const tagsWithStatus = res?.data?.tags.map((item: any) => ({...item, active: false }))
      setTags(tagsWithStatus)
    }
  }

  const handleTagClick = (event: MouseEvent<HTMLElement>) => {
    const activeItem = (event.target as HTMLElement).innerText

    const newTags = tags.map(item => {
      if (item.name === activeItem) {
        item.active = !item.active
      }
      return item
    })
    setTags(newTags)
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <Button onClick={handleClick}>
        <Typography variant="body1" textTransform="none">
          Tags
        </Typography>
        <KeyboardArrowDownIcon />
      </Button>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Quiz Questions"
        inputProps={{ 'aria-label': 'Search Quiz Questions' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        style={{
          top: '10px'
        }}
      >
        <div className={styles.tagPopup}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {tags.map((item) => {
              return (
                <Chip 
                  label={item.name}
                  color="primary" 
                  variant={item.active ? 'filled' : 'outlined'}
                  key={item.tagId} 
                  className={styles.tagItem}
                  onClick={handleTagClick}
                />
              )
            })}
          </Stack>
        </div>
      </Popover>
    </Paper>
  );
}