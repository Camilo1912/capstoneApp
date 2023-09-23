import ContextMenu from "../components/ContextMenu";

const ContentLayout = () => {
    return (
        <div className="content-layout">
            <div className="sidebar">
                <ContextMenu />
            </div>
            <div className="body">layout body</div>
        </div>
    );
};

export default ContentLayout;