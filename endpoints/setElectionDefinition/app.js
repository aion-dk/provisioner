const {
  Election,
  ApiResponse,
  ApiRequire,
  FileServer,
  FileInProcessing,
} = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  console.log('Inside lambda handler')
  let initialStatus = "started",
    errorMsg = "";
  const requiredArgs = ["electionId", "EDFFile"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { electionId, EDFFile } = messageBody;
  console.debug("Election ID: " + electionId);

  //Update request
  console.debug("Finding election:");
  const election = await Election.findByElectionId(electionId);
  console.debug("Got election:");
  console.debug(election);
  if (!election) {
    return ApiResponse.noMatchingElection(electionId);
  } else {
    console.debug("Initiating EDF Submission...");
    const [success, message] = await election.initiateEDFSubmission(
      EDFFile,
      initialStatus,
      errorMsg
    );
    console.debug("Success: " + success);
    console.debug("Message: " + message);

    const electionDefinitionURL = FileServer.genUrl(EDFFile);
    console.debug(
      "Updating election: " +
        electionId +
        " with EDF URL: " +
        electionDefinitionURL
    );

    await election.update({
      electionDefinitionFile: EDFFile,
      electionDefinitionURL,
    });

    console.debug("Done updating election...");

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
