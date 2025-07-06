const AppLayout = ({ children }) => {
    return (
        <div className="bg-[url(bg.jpg)] bg-cover h-dvh w-dvw">
            <div className="mx-auto p-8">{children}</div>
        </div>
    );
};

export default AppLayout;