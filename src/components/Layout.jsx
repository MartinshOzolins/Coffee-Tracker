import {useState} from "react"
import Modal from "./Modal";
import Authentication from "./Authentication";

//useAuth() - custom hook created inside AuthContext.jsx, which provied all values that we pass in AuthContext.Provider
import { useAuth } from "../context/AuthContext";

export default function Layout(props) {
  const { children } = props;
  const [showModal, setShowModal] = useState(false)
  const {globalUser, logout} = useAuth()
  const header = (
    <header>
      <div>
        <h1 className="text-gradient">Coffee Tracker</h1>
      </div>
      {globalUser ? (<button onClick={logout}>
        <p>LogOut</p>
        <i className="fa-solid fa-mug-saucer"></i>
      </button>
      ) : (<button onClick={() => (setShowModal(true))}>
      <p>Sign up free</p>
      <i className="fa-solid fa-mug-saucer"></i>
      </button>)}
    </header>
  );
  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Coffee Tracker</span> was made by Cofee
        Lover
      </p>
    </footer>
  );
  
  function handleCloseModal() {
      setShowModal(false)
  }

  return (
    <>
      {showModal && (<Modal handleCloseModal={handleCloseModal}>
        <Authentication handleCloseModal={handleCloseModal}/>
      </Modal>)}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
