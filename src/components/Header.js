import PropTypes from "prop-types";
import Button from "./Button";

const Header = ({ title, onAdd, showSearch }) => {
  return (
    <header className="header">
      {/* <h1 style = {headingStyle}>{title}</h1> */}
      <h1>{title}</h1>
      <Button
        color={showSearch ? "Orange" : "green"}
        text={showSearch ? "End Search" : "Search"}
        onClick={onAdd}
      />
    </header>
  );
};

Header.defaultProps = {
  title: "Top Related Skill Graph",
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

// CSS in JS
// const headingStyle = {
//     color: 'red', backgroundColor: 'black'
// }

export default Header;
