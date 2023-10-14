import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import { useState } from 'react';
import { useSelectedComponent } from '../contexts/SelectedComponentContext';

const Navbar = () => {
    const [value, setValue] = useState(0);
    const { setSelectedComponent } = useSelectedComponent();

    return (
        <div className="navbar-wrapper">
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    setSelectedComponent(newValue)
                }}
            >
                <BottomNavigationAction label="Anuncios" value={0} icon={<NewspaperIcon />} />
                <BottomNavigationAction label="Proyectos" value={1} icon={<HandymanOutlinedIcon />} />
                <BottomNavigationAction label="Encuestas" value={2} icon={<BallotOutlinedIcon />} />
                <BottomNavigationAction label="Calendario" value={3} icon={<CalendarMonthOutlinedIcon />} />
                <BottomNavigationAction label="Actividades" value={4} icon={<NaturePeopleOutlinedIcon />} />
                <BottomNavigationAction label="Solicitudes" value={5} icon={<ScheduleSendOutlinedIcon />} />
            </BottomNavigation>
        </div>
    );
};

export default Navbar;