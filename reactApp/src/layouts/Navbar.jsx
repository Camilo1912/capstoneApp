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
import { useMediaQuery, useTheme } from '@mui/material';


// Estilos para tema claro
const lightThemeStyles = {
    backgroundColor: '#FFFFFF',
    color: '#a0a0a0',
    selectedColor: '#4181ed',
};

// Estilos para tema oscuro
const darkThemeStyles = {
    backgroundColor: '#222222',
    color: '#FFFFFF',
    selectedColor: '#4990e7',
};

const Navbar = () => {
    const [value, setValue] = useState(0);
    const { setSelectedComponent } = useSelectedComponent();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const styles = prefersDarkMode ? darkThemeStyles : lightThemeStyles;

    return (
        <div className="navbar-wrapper">
            <BottomNavigation
                showLabels
                value={value}
                style={styles}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    setSelectedComponent({nav: newValue, menu: 0});
                }}
            >
                <BottomNavigationAction label="Anuncios" value={0} icon={<NewspaperIcon />} style={{color: value === 0 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} />
                <BottomNavigationAction label="Proyectos" value={1} icon={<HandymanOutlinedIcon />} style={{color: value === 1 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} />
                {/* <BottomNavigationAction label="Encuestas" value={2} icon={<BallotOutlinedIcon />} style={{color: value === 2 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} /> */}
                <BottomNavigationAction label="Calendario" value={3} icon={<CalendarMonthOutlinedIcon />} style={{color: value === 3 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} />
                <BottomNavigationAction label="Actividades" value={4} icon={<NaturePeopleOutlinedIcon />} style={{color: value === 4 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} />
                <BottomNavigationAction label="Solicitudes" value={5} icon={<ScheduleSendOutlinedIcon />} style={{color: value === 5 ? styles.selectedColor : styles.color, backgroundColor: styles.backgroundColor}} />
            </BottomNavigation>
        </div>
    );
};

export default Navbar;