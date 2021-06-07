import PropTypes from "prop-types";
// import Button from "./Button";
import { useRef,useState } from "react";
import ReactSearchBox from "react-search-box";
import { Dialog, Button } from "@ui5/webcomponents-react";
import { createPortal } from "react-dom";
import JsonData from "../data/db.json";

const DialogComponent = ({ targetSkill }) => {
  const dialogRef = useRef(null);
  const [allData, setAllData] = useState({
    nodes: JsonData.nodes,
    links: JsonData.links,
  });
  const onButtonClick = () => {
    console.log(targetSkill);
    dialogRef.current.open();
  };
  return (
    <>
      <Button onClick={onButtonClick}>Open Dialog</Button>
      {createPortal(<Dialog ref={dialogRef} />, document.body)}
    </>
  );
};

const Header = ({ skills, skill, searchSkill }) => {
  return (
    <>
      <header className="header">
        <div style={{ marginTop: "8px", width: "80%" }}>
          {/* search box can be improved using Levenstein distance */}
          <ReactSearchBox
            placeholder="Enter skill name..."
            data={skills}
            onSelect={(record) => {
              searchSkill(record.value);
            }}
            fuseConfigs={{
              //fuzzy search
              threshold: 0.1,
            }}
          />
        </div>{" "}
        <DialogComponent targetSkill={skill}></DialogComponent>
      </header>
    </>
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
