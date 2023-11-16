
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useSelectedComponent } from '../contexts/SelectedComponentContext';

const ContextMenu = ({ data }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { setSelectedComponent, selectedComponent } = useSelectedComponent();

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        setSelectedComponent({...selectedComponent, menu: index});
    };

    return (
        <div className="context-menu-wrapper">
            <h2>Opciones</h2>
            <List component="nav" aria-label="main mailbox folders">
                {data.map((option, index) => (
                    <ListItemButton
                        selected={selectedComponent.menu === index}
                        key={index}
                        onClick={(event) => handleListItemClick(event, index)}
                    >
                        <ListItemIcon>
                            {option.icon}
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );
};

export default ContextMenu;