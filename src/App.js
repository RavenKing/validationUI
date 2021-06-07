import React, { useState } from "react";
import Header from "./components/Header";
import JsonData from "./data/skill.json";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import ForceGraph from "./components/ForceGraph";

// import data from './data/layer3.json'

function App() {
  const [skill, searchSkill] = useState("");
  const onAdd=(something)=>{console.log(something)}
  const skills = [];
  JsonData.map((v) => {
    const key = Math.floor(Math.random() * 10000000 + 1);
    return skills.push({ key, ...v });
  });

  return (
    <div className="container">
      <ui5-shellbar
        primary-title="Top Skills"
       
      >
        <ui5-avatar slot="profile" icon="customer"></ui5-avatar>
        <img slot="logo" src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg" />
        <ui5-button icon="nav-back" slot="startButton"></ui5-button>
      </ui5-shellbar>
      <Header
      skills={skills}
        searchSkill={searchSkill}
        skill={skill}
      />
     
      {/* <React.Fragment>
        <ForceGraph linksData={data.links} nodesData={data.nodes} nodeHoverTooltip={nodeHoverTooltip} />
      </React.Fragment> */}

      <React.Fragment>
        <ForceGraph skill={skill} />
      </React.Fragment>
    </div>
  );
}

export default App;
