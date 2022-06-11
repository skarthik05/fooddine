import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Restaurant from './Screen/Restaurant/Restaurant';
import Menu from './Screen/Menu/Menu';
function App() {
  // const 
  return (
    <div className="App">
     <Routes>
       <Route path="/user/:id" element={<Menu />} />
       <Route path="/restaurant" element={<Restaurant />} />
     </Routes>
     <ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
			/>
    </div>
  );
}

export default App;
