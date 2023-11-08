import React from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';

const GuestHeader = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='guest-header-wrapper'>
            <div>
                <IconButton aria-label="Volver al inicio" size='small' onClick={() => {navigate('/')}}>
                    <ArrowBackIosNewRoundedIcon />
                </IconButton>
            </div>

            <div className='guest-nav-container'>
            <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon position tabs example"
            classes={{ root: 'custom-tabs-root' }}
            >
                <Tab icon={<AnnouncementRoundedIcon />} iconPosition="start" label="start" className="custom-tab"/>
            </Tabs>
            </div>
        </div>
    )
}

export default GuestHeader