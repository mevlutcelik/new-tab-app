const AppLayout = ({ children }) => {
    return (
        <div className="bg-[url(bg.jpg)] bg-cover h-full min-h-screen w-full">
            <div className="mx-auto p-6 flex flex-col gap-4">{children}</div>
        </div>
    );
};

export default AppLayout;