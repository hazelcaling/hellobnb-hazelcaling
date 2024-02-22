import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css'
import { useState } from 'react';



function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [menuOpen, setMenuOpen] = useState(false);



  let sessionLinks;

  if (sessionUser) {
    sessionLinks = (
      <>
        <div><Link to='new-spot'>Create New Spot</Link></div>
        <li><ProfileButton user={sessionUser} /></li>
      </>
    );
  } else {
    sessionLinks = (
        <div className='button-container'>
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </div>
    );
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className='navbar'>
      <Link to='/'><div className='logo'><FaAirbnb style={{color: "#f25090", fontSize: "4em"}}/></div></Link>
      <div className='menu-toggle' onClick={toggleMenu}>
        <div className='menu-icon'>&#9776;</div>
        <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        {isLoaded && sessionLinks}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
