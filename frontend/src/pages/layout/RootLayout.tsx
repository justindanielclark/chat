import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <header className="bg-cyan-100">HEADER</header>
      <main className="bg-blue-100 flex-1">
        <Outlet />
      </main>
      <footer className="bg-cyan-100">FOOTER</footer>
    </>
  );
}
