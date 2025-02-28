import {
  BallotFile,
  Election,
  ElectionConfiguration,
  ElectionCreate,
  ElectionDefinition,
  ElectionServingStatus,
  ElectionStatus,
  Maybe,
} from "types";
import { VoterRecord } from "types/voter";
import { get, post, uploadFile, SuccessResult, uploadFileNew } from "./base";
import * as d3 from 'd3'

const defaultElection = {
  electionId: "default-election",
  electionJurisdictionName: "Gadget County",
  electionName: "Special Election",
  electionStatus: ElectionStatus.pending,
  servingStatus: ElectionServingStatus.closed,
  electionDate: "2202-11-07",
  electionLink: "https://www.google.com",

  voterCount: 525,
  ballotDefinitionCount: 200,
  ballotCount: 200,

  configuration: {
    stateName: "The Future",
    stateCode: "TF",
  },
};

export const getAll = async (): Promise<Array<Election>> => {
  return await get("/getElection", { defaultReturn: [defaultElection] });
};

export const getCurrentElection = async (): Promise<Maybe<Election>> => {
  try {
    return await get("/getCurrentElection");
  } catch (err: any) {
    console.log(err?.response?.data);
    return null;
  }
};

export const getCurrentTestElection = async (): Promise<Maybe<Election>> => {
  try {
    return await get("/getCurrentElection", {
      headers: {
        "User-Agent": "test",
        "X-User-Agent": "test",
      },
    });
  } catch (err: any) {
    console.log(err?.response?.data);
    return null;
  }
};

export const createElection = async (
  election: ElectionCreate
): Promise<Election> => {
  const resp = await post("/createElection", election, {
    defaultReturn: { electionId: defaultElection.electionId },
  });
  return resp;
};

export const setElectionAttributes = async (
  election: Election
): Promise<Election> => {
  const defaultElection = { ...election };
  defaultElection.electionId = defaultElection.electionId || "default-election";
  const resp = await post("/setElectionAttributes", election, {
    defaultReturn: defaultElection,
  });
  return resp;
};

export const getElection = async (electionId: string): Promise<Election> => {
  const resp = await post(
    "/getElection",
    {
      electionId: electionId,
    },
    { defaultReturn: defaultElection }
  );
  return resp;
};

// export const getConfiguration = async(electionId:  string): Promise<ElectionConfiguration> => {
//   return await get(`/getConfiguration?electionId=${electionId}`, {defaultReturn: defaultElection})
// }

export const setElectionConfigurations = async (
  electionId: string,
  configurations: ElectionConfiguration
): Promise<Election> => {
  const defaultElectionData = { ...defaultElection, configurations };
  const resp = await post(
    `/setElectionConfigurations`,
    {
      electionId,
      configurations,
    },
    { defaultReturn: defaultElectionData }
  );
  return resp;
};

//ElectionDefinition
export const setElectionDefinition = async (
  electionId: string,
  EDF: File
) => {
  try {
    const defaultElectionData = { ...defaultElection, electionDefinition: EDF };

    const fileName = await uploadFileNew(EDF);

    // BallotStyles count
    const fileText = await EDF.text()
    const fileJson = JSON.parse(fileText)
    let ballotStyles = 0
    const foundElectionsInDefinition = fileJson?.Election
    if (foundElectionsInDefinition.length > 0) {
      const ballotStyle = foundElectionsInDefinition[0].BallotStyle
      if (ballotStyle) {
        ballotStyles = ballotStyle.length
      }
    }

    const res = await post(
      `/setElectionDefinition`,
      {
        electionId,
        EDFFile: fileName,
        ballotStyles
      },
      { defaultReturn: defaultElectionData }
    );
    return res;
  } catch (e) {
    console.log("Exception:");
    console.log(e);
  }
};

export const getElectionDefinitionStatus = async (uuid: string) => {
  return await post(
    `/getElectionDefinitionStatus`,
    {
      objectId: uuid,
    },
    { defaultReturn: { success: true } }
  );
};

export const setBallotDefinitions = async (
  electionId: string,
  ballot: BallotFile
) => {
  try {
    const fileName = await uploadFileNew(ballot.file, ballot.ballotID)

    return await post(
      `/setBallotDefinitions`,
      {
        electionId,
        ballotFile: fileName,
      },
      { defaultReturn: { success: true } }
    );
  } catch (e) {
    console.log('Exception:')
    console.log(e)
  }
};

export const setElectionVoters = async (electionId: string, voterListFile: File) => {
  const contents = await voterListFile.text()
  const voterList = d3.csvParse(contents);

  return await post(
    `/setElectionVoters`,
    {
      electionId,
      voterList
    }
  );
};

export const openElectionTest = async (electionId: string) => {
  return await post("/openElectionTest", { electionId });
};

export const closeElectionTest = async (electionId: string) => {
  return await post("/closeElectionTest", { electionId });
};

export const openElection = async (electionId: string) => {
  return await post("/openElection", { electionId });
};

export const closeElection = async (electionId: string) => {
  return await post("/closeElection", { electionId });
};

export const setCurrentElection = async (electionId: string) => {
  return await post("/setCurrentElection", { electionId });
};

export const getFileStatus = async (objectId: string) => {
  return await post(
    `/getElectionDefinitionStatus`,
    {
      objectId,
    },
    { defaultReturn: { success: true } }
  );
};

export const setElectionBallots = async (electionId: string, EDF: File) => {
  const fileName = await uploadFile(`/setElectionBallots`, EDF, {
    electionId,
  });

  await sleep(2000);

  const result = await post(`/setElectionBallots`, {
    electionId,
    objectId: fileName,
  });

  return {
    objectKey: fileName,
  };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const setTestVoterFile = async (
  electionId: string,
  fileContents: File
) => {
  // Previous
  // return await uploadFile(
  //   `/setTestVoterFile?electionId=${electionId}`,
  //   fileContents,
  //   {},
  //   {
  //     defaultReturn: {
  //       ...(await getElection(electionId)),
  //       testVoterCount: 17,
  //     },
  //   }
  // );

  // 2022-december-demo
  const fileName = await uploadFile(`/setElectionVoters`, fileContents, {
    electionId,
  });

  await sleep(2000);

  const result = await post(`/setElectionVoters`, {
    electionId,
    objectId: fileName,
    latMode: true,
  });

  return {
    objectKey: fileName,
  };
};
