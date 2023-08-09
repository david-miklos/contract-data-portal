import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="border-b-2">
      <ul className="flex space-x-10 justify-center p-6">
        <li className="font-bold text-lg">
          <Link to="/">Home</Link>
        </li>
        <li className="font-bold text-lg">
          <Link to="/patient">Patient</Link>
        </li>
        <li className="font-bold text-lg">
          <Link to="/contract">Contract</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
