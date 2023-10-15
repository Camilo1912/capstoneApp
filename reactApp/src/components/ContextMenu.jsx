
import { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
                        selected={selectedIndex === index}
                        key={option}
                        onClick={(event) => handleListItemClick(event, index)}
                    >
                        <ListItemText primary={option} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );
};

export default ContextMenu;