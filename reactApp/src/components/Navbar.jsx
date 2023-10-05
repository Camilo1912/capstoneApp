import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import { useState } from 'react';

const Navbar = () => {
    const [value, setValue] = useState(0);

    return (
        <div className="navbar-wrapper">
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Anuncios" icon={<NewspaperIcon />} />
                <BottomNavigationAction label="Proyectos" icon={<HandymanOutlinedIcon />} />
                <BottomNavigationAction label="Encuestas" icon={<BallotOutlinedIcon />} />
                <BottomNavigationAction label="Calendario" icon={<CalendarMonthOutlinedIcon />} />
                <BottomNavigationAction label="Actividades" icon={<NaturePeopleOutlinedIcon />} />
                <BottomNavigationAction label="Solicitudes" icon={<ScheduleSendOutlinedIcon />} />
            </BottomNavigation>
        </div>
    );
};

export default Navbar;