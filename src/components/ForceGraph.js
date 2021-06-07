import React, { useRef, useEffect, useState, useCallback } from "react";
import ForceGraphGenerator from "./ForceGraphGenerator";
import styles from "./forceGraph.module.css";
import JsonData from "../data/db.json";


const ForceGraph = ({ skill }) => {
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
        userNodesClicked
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [skillShow]);

  return <div ref={containerRef} className={styles.container} id="forceGraph"/>;
};

export default ForceGraph;
