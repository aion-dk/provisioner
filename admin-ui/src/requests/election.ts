import {
  BallotFile,
  Election,
  ElectionConfiguration,
  ElectionCreate,
  ElectionDefinition,
  ElectionStatus,
} from "types";
import { VoterRecord } from "types/voter";
import { get, post, uploadFile, SuccessResult, uploadFileNew } from "./base";
import * as d3 from 'd3'

const defaultElection = {
  electionId: "default-election",
  electionJurisdictionName: "Gadget County",
  electionName: "Special Election",
  electionStatus: ElectionStatus.pending,
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

const ensureConfigurationsObject = (election: Election): Election => {
  console.log(election);
  if (election.configurations && typeof election.configurations === "string") {
    election.configurations = JSON.parse(election.configurations as string);
  }
  return election;
};

export const createElection = async (
  election: ElectionCreate
): Promise<Election> => {
  const resp = await post("/createElection", election, {
    defaultReturn: { electionId: defaultElection.electionId },
  });
  return ensureConfigurationsObject(resp);
};

export const setElectionAttributes = async (
  election: Election
): Promise<Election> => {
  const defaultElection = { ...election };
  defaultElection.electionId = defaultElection.electionId || "default-election";
  const resp = await post("/setElectionAttributes", election, {
    defaultReturn: defaultElection,
  });
  return ensureConfigurationsObject(resp);
};

export const getElection = async (electionId: string): Promise<Election> => {
  const resp = await post(
    "/getElection",
    {
      electionId: electionId,
    },
    { defaultReturn: defaultElection }
  );
  return ensureConfigurationsObject(resp);
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
  return ensureConfigurationsObject(resp);
};

//ElectionDefinition
export const submitElectionDefinition = async (
  electionId: string,
  EDF: File
) => {
  try {
    const defaultElectionData = { ...defaultElection, electionDefinition: EDF };

    const fileName = await uploadFileNew(EDF);

    const res = await post(
      `/submitElectionDefinition`,
      {
        electionId,
        EDFFile: fileName,
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
      uuid,
    },
    { defaultReturn: { success: true } }
  );
};

export const setBallotDefinitions = async (
  electionId: string,
  ballots: Array<BallotFile>
) => {
  return await post(
    `/setBallotDefinitions`,
    {
      electionId,
      ballots,
    },
    { defaultReturn: { success: true } }
  );
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

export const setTestVoterFile = async (
  electionId: string,
  fileContents: File
) => {
  return await uploadFile(
    `/setTestVoterFile?electionId=${electionId}`,
    fileContents,
    {},
    {
      defaultReturn: {
        ...(await getElection(electionId)),
        testVoterCount: 17,
      },
    }
  );
};
