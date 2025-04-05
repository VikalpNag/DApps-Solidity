import logo from "../assets/logo.svg";

const Navigation = ({ account, setAccount }) => {
  return (
    <nav>
      <ul className="nav__links">
        <li href="#">Buy</li>
        <li href="#">Rent</li>
        <li href="#">Sell</li>
      </ul>

      <div className="nav__brand">
        <img src={logo} alt="logo" />
        <h1>Millow</h1>
      </div>

      <button type="button" className="nav__connect">
        0x0
      </button>
    </nav>
  );
};

export default Navigation;
