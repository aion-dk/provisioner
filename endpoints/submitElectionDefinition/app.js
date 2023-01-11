const {
  Election,
  ApiResponse,
  ApiRequire,
  FileServer,
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
      return ApiResponse.makeResponse(200, { uuid: EDFFile });
    } else {
      return ApiResponse.makeErrorResponse(message);
    }
  }

  // const latMode =
  //   event &&
  //   event.headers &&
  //   (event.headers["User-Agent"] || "").toLowerCase().indexOf("test") >= 0
  //     ? 1
  //     : 0;

  // const curElection = await Election.currentElection(latMode);
  // console.log("Current election:");
  // console.log(curElection);

  // console.log("Election definition URL?: " + election?.electionDefinitionURL);

  // try {
  //   console.log("Initiating EDF Submission");
  //   const [success, message] = await election.initiateEDFSubmission(
  //     EDFFile,
  //     initialStatus,
  //     errorMsg
  //   );
  //   console.log(success);
  //   console.log(message);

  //   await election.update({ electionDefinitionFile: EDFFile });
  // } catch (err) {
  //   console.log("Error:");
  //   console.log(err);
  //   return ApiResponse.makeResponse(523, { uuid: "mock-uuid" });
  // }

  return ApiResponse.makeResponse(200, { uuid: "mock-uuid" });
  // let initialStatus = "started",
  //   errorMsg = "";

  // const requiredArgs = ["electionId"];
  // const messageBody = JSON.parse(event.body);

  // if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
  //   return ApiResponse.makeRequiredArgumentsError();
  // }

  // const { electionId, EDFJSON, EDFFile } = messageBody;

  // if (!(EDFJSON || EDFFile)) {
  //   return ApiResponse.makeRequiredArgumentsError(
  //     "One of EDFJSON or EDFFile must be provided"
  //   );
  // }

  // const EDFAsJSON =
  //   EDFJSON && typeof EDFJSON == "object" ? JSON.stringify(EDFJSON) : EDFJSON;

  // if (
  //   process.env.AWS_SAM_LOCAL ||
  //   process.env.DEPLOYMENT_ENVIRONMENT.startsWith("development")
  // ) {
  //   /*
  //     Potential Easter Eggs here
  //   */
  //   if (EDFFile && !EDFFile.endsWith(".zip")) {
  //     initialStatus = "error";
  //     errorMsg = "File is not a valid zip archive.";
  //   }
  //   if (EDFJSON && typeof EDFJSON == "object" && EDFJSON.error) {
  //     initialStatus = "error";
  //     errorMsg = "File is not a valid zip archive.";
  //   }
  // }

  // if (electionId) {
  //   //Update request
  //   const election = await Election.findByElectionId(electionId);
  //   if (!election) {
  //     return ApiResponse.noMatchingElection(electionId);
  //   } else {
  //     //TBD: John and Alex to implement validation routines
  //     //await election.update({ electionDefinition: EDFJSON });

  //     //New model: create file and start background processing

  //     if (EDFJSON) {
  //       const uuid = context.awsRequestId;

  //       const [success, message] = await election.startEDFSubmission(
  //         uuid,
  //         EDFAsJSON,
  //         initialStatus,
  //         errorMsg
  //       );

  //       await election.update({ electionDefinitionFile: uuid });
  //       if (success) {
  //         return ApiResponse.makeResponse(200, { uuid: uuid });
  //       } else {
  //         return ApiResponse.makeErrorResponse(message);
  //       }
  //     } else {
  //       const [success, message] = await election.initiateEDFSubmission(
  //         EDFFile,
  //         initialStatus,
  //         errorMsg
  //       );

  //       await election.update({ electionDefinitionFile: EDFFile });
  //       if (success) {
  //         return ApiResponse.makeResponse(200, { uuid: EDFFile });
  //       } else {
  //         return ApiResponse.makeErrorResponse(message);
  //       }
  //     }
  //   }
  // }
};
