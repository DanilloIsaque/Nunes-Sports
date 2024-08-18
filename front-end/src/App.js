import Produtos from "./paginas/Produtos";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Produtos />} />
          </Routes>
          </BrowserRouter>
    
  );
}

export default App;
