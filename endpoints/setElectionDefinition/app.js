const {
  Election,
  ApiResponse,
  ApiRequire,
  FileServer,
  FileInProcessing,
} = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  let initialStatus = "started",
    errorMsg = "";
  const requiredArgs = ["electionId", "EDFFile", "ballotStyles"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { electionId, EDFFile, ballotStyles } = messageBody;

  const election = await Election.findByElectionId(electionId);
  if (!election) {
    return ApiResponse.noMatchingElection(electionId);
  } else {
    const electionDefinitionURL = FileServer.genUrl(EDFFile);

    await election.update({
      edfSet: true,
      electionDefinitionFile: EDFFile,
      electionDefinitionURL,
      electionDefinitionCount: ballotStyles
    });

    console.debug("Done updating election...");

    return ApiResponse.makeResponse(200, {
      status: "complete",
      uuid: EDFFile,
    });
  } 
};
