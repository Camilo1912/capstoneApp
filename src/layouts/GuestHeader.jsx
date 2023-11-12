import React from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Button, IconButton } from '@mui/material';
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
                    centered
                    >
                        <Tab icon={<AnnouncementRoundedIcon />} iconPosition="start" label="start" className="custom-tab"/>
                        <Tab icon={<AnnouncementRoundedIcon />} iconPosition="start" label="start" className="custom-tab"/>
                        <Tab icon={<AnnouncementRoundedIcon />} iconPosition="start" label="start" className="custom-tab"/>
                        <Tab icon={<AnnouncementRoundedIcon />} iconPosition="start" label="start" className="custom-tab"/>
                    </Tabs>
                </div>
            </div>

        </div>
    )
}

export default GuestHeader