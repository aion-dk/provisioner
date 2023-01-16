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
      edfSet: true,
      electionDefinitionFile: EDFFile,
      electionDefinitionURL,
    });

    // console.log('Figuring out ballot styles length:')
    // console.log(file.name, file.size)
    // const fileText = await file.text()
    // console.log('File text: ' + fileText.length)
    // // console.log(fileText)
    // const fileJson = JSON.parse(fileText)
    // console.log('File json: ' + Object.keys(fileJson).length)
    // // console.log(fileJson)

    // let ballotStyles = 0
    // const foundElectionsInDefinition = fileJson?.Election
    // console.log(foundElectionsInDefinition.length)
    // if (foundElectionsInDefinition.length > 0) {
    //   console.log('1')
    //   const ballotStyle = foundElectionsInDefinition[0].BallotStyle
    //   console.log(!!ballotStyle)
    //   if (ballotStyle) {
    //     console.log('2')
    //     ballotStyles = ballotStyle.length
    //   }
    // }
    // console.log(ballotStyles)

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
