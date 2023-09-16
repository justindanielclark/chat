import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <header className="bg-red-100 p-1 sticky top-0">HEADER</header>
      <main className="bg-blue-100 flex-1">
        <Outlet />
      </main>
      <footer className="bg-red-100 p-1">FOOTER</footer>
    </>
  );
}
