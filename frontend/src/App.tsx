import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <header>Header</header>

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </>
  );
};

export default MainLayout;
