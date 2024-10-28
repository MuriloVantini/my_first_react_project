import "./index.css";
import Navbar from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

function App() {
  

  
  return (
    <>
      <Navbar  />
      <Outlet />
      <Toaster
        richColors
        duration={3500}
        theme="light"
        position="top-right"
        visibleToasts={5}
      />
    </>
  );
}

export default App;
