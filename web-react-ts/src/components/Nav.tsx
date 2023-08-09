import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/patient">Patient</Link>
        </li>
        <li>
          <Link to="/contract">Contract</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
