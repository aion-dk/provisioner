const { Election, ApiResponse } = require("/opt/Common");
const { getLatModeFromEvent } = require("/opt/LatMode");

exports.lambdaHandler = async (event, context, callback) => {
  const latMode = getLatModeFromEvent(event);
  
  const election = await Election.currentElection(latMode);
  if (!election) {
    return ApiResponse.noElectionResponse();
  }

  const url = election.electionDefinitionURL();

  // return ApiResponse.makeResponse(200, { electionDefinitionURL: url });
  return ApiResponse.makeResponse(200, {
    electionDefinitionURL: "http://bucket:8081/edfs/precinct_4_bedrock.json"
  });
};
