import ContextMenu from "../components/ContextMenu";
import News from "../components/News/News";
import PollsContainer from "../components/Polls/PollsContainer";
import ProjectsContainer from "../components/ProjectsComp/ProjectsContainer";
import CalendarContainer from "../components/CalendarContainer";
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import ActivitiesContainer from "../components/Activities/ActivitiesContainer";
import SolicitudContainer from "../components/SolicitudContainer";
import MembersContainer from "../components/Members/MembersContainer";

const PresidentHome = () => {
    const { selectedComponent } = useSelectedComponent();

    const contextualMenuOptions = {
        "Anuncios": [
            'Ver anuncios',
            'Crear anuncio'
        ],
        "Proyectos": [
            'Ver proyectos',
            'Crear propuesta',
            'Votaciones'
        ],
        "Encuestas": [
            'Activas',
            'Finalizadas',
            'Respondidas',
            'Resultados'
        ],
        "Calendario": [
            'Todo'
        ],
        "Actividades": [
            'Proximas actividades',
            'Activiades pasadas',
            'Editar actividades',
            'Crear actividad'
        ],
        "Solicitudes": [
            'Solicitudes',
            'Nueva solicitud',
            'Solicitudes resueltas'
        ],
        "Nosotros": [
            'Información',
            'Integrantes'
        ]
    };

    let contentComponent;
    let contextualMenuOptionsForComponent;

    switch (selectedComponent.nav) {
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
            contentComponent = <SolicitudContainer />;
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
}

export default PresidentHome