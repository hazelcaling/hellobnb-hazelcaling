import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { IoPersonCircle } from "react-icons/io5";
import * as sessionActions from '../../store/session';

import { useNavigate } from 'react-router-dom';
function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate()


    const toggleMenu = (e) => {
      e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
      // if (!showMenu) setShowMenu(true);
      setShowMenu(!showMenu);
    };

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
    };

    const manageSpots = () => {
      navigate('/spots')
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
      <>
        <button onClick={toggleMenu}>
          <IoPersonCircle />
        </button>
        <ul className={ulClassName} ref={ulRef}>
          <button onClick={manageSpots}>Manage Spots</button>
          <li>{user.username}</li>
          <li>{user.firstName} {user.lastName}</li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      </>
    );
  }

  export default ProfileButton;
