import React, { useRef, useEffect, useState, useCallback } from "react";
import ForceGraphGenerator from "./ForceGraphGenerator";
import styles from "./forceGraph.module.css";
import JsonData from "../data/db.json";

import { Dialog, Wizard,WizardStep,TextArea,Button,MessageStrip,Switch  } from "@ui5/webcomponents-react";
import { createPortal } from "react-dom";

// const DialogComponent = () => {
//   const dialogRef = useRef(null);
//   const onButtonClick = () => {
//     //console.log(targetSkill);
//     dialogRef.current.open();
//   };
//   return (
//     <>
//       <Button onClick={onButtonClick}>Open Dialog</Button>
//       {createPortal(<Dialog ref={dialogRef} />, document.body)}
//     </>
//   );
// };

const ForceGraph = ({ skill }) => {
  const dialogRef = useRef(null);
  const [targetSkill,setTargetSkill] = useState("")
  const [sourceSkill,setSourceSkill] = useState({})
  const openDialog = (e) => {
    //console.log(targetSkill);
    console.log(e);
    setTargetSkill(e.name);
    console.log(skillShow);
    skillShow.links.map((source)=>{
      if(source.target===e.name)
      {
        setSourceSkill(source) 
      }
    })
    dialogRef.current.open();
  };
  const ComboBoxComponent=()=>{
    return (
    <div>
   <Wizard
    icon="hint"
  className=""
  onSelectionChange={function noRefCheck(){}}
  slot=""
  style={{
    height: '400px',
    width:'600px'
  }}
  tooltip=""
>
  <WizardStep
    heading= {sourceSkill.source}
    icon="hint"
    disabled
  >
  </WizardStep>
  <WizardStep
    heading= {targetSkill}
    icon="hint"
    selected
  >
    <MessageStrip
  className=""
  onClose={function noRefCheck(){}}
  slot=""
  style={{}}
  tooltip=""
>
  The similarity between {sourceSkill.source} and {sourceSkill.target} is {parseFloat(sourceSkill.similarity).toFixed(2)}!
  Agree or Deny the relationship will help us improve our tool.
</MessageStrip>
Are they Relavent?<Switch
  className=""
  onChange={function noRefCheck(){}}
  slot=""
  style={{}}
  textOff=""
  textOn=""
  tooltip=""
/>
<br/>

Comments：

     <TextArea
  className=""
  onChange={function noRefCheck(){}}
  onInput={function noRefCheck(){}}
  slot=""
  style={{}}
  tooltip=""
/>
<Button style={{marginTop:"10px"}}> submit </Button>
  </WizardStep>
  </Wizard>

  </div>)
   
  };

  const containerRef = useRef(null);
  const [userNodes, setuserNodes] = useState([]);
  const [focussedSkills, setfocussedSkills] = useState(new Set());
  let [allData, setAllData] = useState({
    nodes: [],
    links: [],
  });
  const [skillShow, setSkillShow] = useState({
    nodes: [],
    links: [],
  });

  const nodeHoverTooltip = useCallback((node) => {
    return `<div>     
      <b>${node.name}</b>
    </div>`;
  }, []);

  const fetchSkills = async () => {
    
    const resNodes = JsonData.nodes;
    // const nodeData = await resNodes.json();
    const resLinks =  JsonData.links
    // const linkData = await resLinks.json();
    setAllData({ nodes: resNodes, links: resLinks });
    // return { nodeData, linkData };
  };

  useEffect(() => {
    console.log("get all data...");
    fetchSkills();
  }, []);

  const getSkills = async (skill) => {
    console.log("get skill now...");
    // const { nodeData, linkData } = await fetchSkills();
    const linkFound = allData.links.filter((link) => link.source === skill);
    const nodeResult = linkFound.map((l) => l.target);
    nodeResult.push(skill);
    const nodeFound = allData.nodes.filter((node) =>
      nodeResult.includes(node.name)
    );
    setSkillShow({
      nodes: nodeFound,
      links: linkFound,
    });
    if (document.querySelectorAll("#forceGraph")[0].childNodes.length > 0) 
    {
      document
        .querySelectorAll("#forceGraph")[0]
        .childNodes[0].remove();
    }
  };

  const getUserSkills = async (skill) => {
    console.log("get user skill now...");
    // const { nodeData, linkData } = await fetchSkills();
    const targetNodes = [...userNodes];
    targetNodes.push(skill);
    const linkFound = allData.links.filter((link) =>
      targetNodes.includes(link.source)
    );
    const nodeResult = linkFound.map((l) => l.target);
    nodeResult.push(skill);
    const allNodes = [...nodeResult, targetNodes];
    const nodeFound = allData.nodes.filter((node) =>
      allNodes.includes(node.name)
    );
    setSkillShow({
      nodes: nodeFound,
      links: linkFound,
    });
    if (
      document.querySelectorAll("#forceGraph")[0].childNodes
        .length > 0
    ) {
      document
        .querySelectorAll("#forceGraph")[0]
        .childNodes[0].remove();
    }
  };


  const setGroupOnuserNodes = async () => {
    // const skillToUpdate = async (name) => {
    //   const item = await fetchSkill(name);
    //   updateSkillToOne(item[0]);
    // };
    const nodeFound = allData.nodes.filter((node) =>
      userNodes.includes(node.name)
    );

    console.log(nodeFound);
    nodeFound.forEach((element) => {
      element.group = 1;
    });
  };

  const setGroupOn = async (name) => {
    // const item = await fetchSkill(name);
    // updateSkillToOne(item[0]);
    const nodeFound = allData.nodes.filter((node) => node.name === name);
    nodeFound[0].group = 1;
    console.log(nodeFound);

    setfocussedSkills((prev) => prev.add(name));
  };



  const setGroupOff = async () => {
    // const skillToUpdate = async (name) => {
    //   const item = await fetchSkill(name);
    //   updateSkillBackToZero(item[0]);
    // };
    focussedSkills.forEach((element) => {
      const nodeFound = allData.nodes.filter((node) => node.name === element);
      nodeFound[0].group = 0;
      // skillToUpdate(element);
    });
    setfocussedSkills(new Set());
  };

  const setGroupOffuserNodes = async () => {
    userNodes.forEach((element) => {
      const nodeFound = allData.nodes.filter((node) => node.name === element);
      nodeFound[0].group = 0;
      // skillToUpdate(element);
    });
    setuserNodes([]);
  };

  useEffect(() => {
    const setbackSkillGraph = async () => {
      if (focussedSkills.size > 0) {
        await setGroupOff();
        await setGroupOffuserNodes();
      }
    };
    const setSkillGraph = async () => {
      if (skill !== "") {
        await setGroupOn(skill);
        setTimeout(() => {
          getSkills(skill);
        }, 200);
      }
    };
    setbackSkillGraph();
    setSkillGraph();
  }, [skill]);

  const userNodesClicked = (nodeName) => {
    setuserNodes((userNodes) => [...userNodes, nodeName]);
  };

  useEffect(() => {
    if (userNodes.length > 0) {
      console.log(userNodes);
      setGroupOnuserNodes();
      setTimeout(() => {
        getUserSkills(skill);
      }, 100);
    }
  }, [userNodes]);

  useEffect(() => {
    let destroyFn;
    if (containerRef.current && skillShow.links.length > 0) {
      console.log("graph regenerated...");
      const { destroy } = ForceGraphGenerator(
        containerRef.current,
        skillShow.links,
        skillShow.nodes,
        nodeHoverTooltip,
        userNodesClicked,
        openDialog
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [skillShow]);

  return <><div ref={containerRef} className={styles.container} id="forceGraph"/>
      {createPortal(<Dialog ref={dialogRef} >
      <ComboBoxComponent />
      </Dialog>, document.body)}
  </>;
};

export default ForceGraph;
