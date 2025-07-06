const AppLayout = ({ children }) => {
    return (
        <div className="bg-[url(https://images.pexels.com/photos/163872/italy-cala-gonone-air-sky-163872.jpeg)] bg-cover h-dvh w-dvw">
            <div className="mx-auto p-8">{children}</div>
        </div>
    );
};

export default AppLayout;