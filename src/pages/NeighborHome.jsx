import ContextMenu from "../components/ContextMenu";
import News from "../components/News/News";
import PollsContainer from "../components/Polls/PollsContainer";
import ProjectsContainer from "../components/ProjectsComp/ProjectsContainer";
import CalendarContainer from "../components/CalendarContainer";
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import ActivitiesContainer from "../components/Activities/ActivitiesContainer";
import MembersContainer from "../components/Members/MembersContainer";
import ApplicationContainer from "../components/Applications/ApplicationContainer";
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';



const NeighborHome = () => {
    const { selectedComponent } = useSelectedComponent();

    const contextualMenuOptions = {
        "Anuncios": [
            { label:'Ver anuncios', icon: <CampaignRoundedIcon />},
        ],
        "Proyectos": [
            { label:'Ver proyectos', icon: <ConstructionRoundedIcon />},
            { label:'Crear propuesta', icon: <AddCircleRoundedIcon />},
            { label:'Votaciones', icon: <HowToVoteRoundedIcon />},
        ],
        "Calendario": [
            { label:'Todo', icon: <CalendarMonthRoundedIcon />},
        ],
        "Actividades": [
            { label:'Todas', icon: <LocalActivityRoundedIcon />},
        ],
        "Solicitudes": [
            { label:'Mis solicitudes', icon: <FactCheckRoundedIcon />},
            { label:'Solicitar Certificado', icon: <AddCircleRoundedIcon />},
            { label:'Solicitar Recurso', icon: <AddCircleRoundedIcon />},
        ],
        "Nosotros": [
            { label:'Información', icon: <InfoRoundedIcon />},
        ]
    };

    let contentComponent;
    let contextualMenuOptionsForComponent;

    switch (selectedComponent['nav']) {
        case 0:
            contentComponent = <News />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Anuncios"];
            break;
        case 1:
            contentComponent = <ProjectsContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Proyectos"];
            break;
        case 2:
            contentComponent = <CalendarContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Calendario"];
            break;
        case 3:
            contentComponent = <ActivitiesContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Actividades"];
            break;
        case 4:
            contentComponent = <ApplicationContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Solicitudes"];
            break;
        case 5:
            contentComponent = <MembersContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Nosotros"];
            break;
        default:
            contextualMenuOptionsForComponent = contextualMenuOptions["Anuncios"];
            contentComponent = <News />;
            break;
    }


    return (
        <div className="content-layout">
            <div className="sidebar">
                <ContextMenu data={contextualMenuOptionsForComponent} />
            </div>
            <div className="main-content">
                {contentComponent}
            </div>
        </div>
    );
};

export default NeighborHome;