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
  const requiredArgs = ["electionId", "EDFFile"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { electionId, EDFFile } = messageBody;

  const election = await Election.findByElectionId(electionId);
  if (!election) {
    return ApiResponse.noMatchingElection(electionId);
  } else {
    const [success, message] = await election.initiateEDFSubmission(
      EDFFile,
      initialStatus,
      errorMsg
    );

    const electionDefinitionURL = FileServer.genUrl(EDFFile);

    await election.update({
      edfSet: true;
      electionDefinitionFile: EDFFile,
      electionDefinitionURL,
    });

    if (success) {
      return ApiResponse.makeResponse(200, {
        status: "complete",
        uuid: EDFFile,
      });
    } else {
      return ApiResponse.makeErrorResponse(message);
    }
  }

  return ApiResponse.makeResponse(200, { uuid: "mock-uuid" });
};
