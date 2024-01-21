import Navbar from "./Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
