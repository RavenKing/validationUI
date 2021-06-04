import React, { useState } from "react";
import Header from "./components/Header";
import JsonData from "./data/skill.json";
import ReactSearchBox from "react-search-box";
import ForceGraph from "./components/ForceGraph";
// import data from './data/layer3.json'

function App() {
  const [skill, searchSkill] = useState("");
  const [showSearch, setShowSearch] = useState(false);
    const thresholdConfig={
      threshold:0.9,
      distance: 1000,      
    };
  const skills = [];
  JsonData.map((v) => {
    const key = Math.floor(Math.random() * 10000000 + 1);
    return skills.push({ key, ...v });
  });

  return (
    <div className="container">
      <Header
        onAdd={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
      />
      {showSearch && (
        <div style={{ marginBottom: "25px" }}>
          {/* search box can be improved using Levenstein distance */}
          <ReactSearchBox
            placeholder="Enter skill name..."
            data={skills}
            // fuseConfigs={thresholdConfig}
            onSelect={(record) => searchSkill(record.value)}
            // onFocus={() => {
            //   console.log("This function is called when is focussed");
            // }}
            // onChange={(value) => console.log(value)}
            fuseConfigs={{
              threshold: 0.1,
            }}
          />
        </div>
      )}

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
