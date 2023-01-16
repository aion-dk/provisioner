const { Voter, Election, ApiResponse, ApiRequire, FileServer } = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  console.log('Inside lambda!')
  const requiredArgs = ["electionId", "ballotFile"];
  const messageBody = JSON.parse(event.body);
  console.log(messageBody)

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { electionId, ballotFile } = messageBody;
  console.log(electionId)

  if (
    process.env.AWS_SAM_LOCAL ||
    process.env.DEPLOYMENT_ENVIRONMENT.startsWith("development")
  ) {
    /*
      Potential Easter Eggs here
    */
  }

  //Update request
  console.log('Getting election!')
  const election = await Election.findByElectionId(electionId);
  console.log('Done getting election')

  if (!election) {
    return ApiResponse.noMatchingElection(electionId);
  } else {
    console.log('Got election!')

    console.log('Updating ballot definitions!')

    const ballotDefinitionURL = FileServer.genUrl(ballotFile);
    await election.updateBallotDefinitions({ [ballotFile]: ballotDefinitionURL })
    console.log('Done updating ballot definitions!')

    const ballotDefinitions = election.getBallotDefinitions();

    return ApiResponse.makeResponse(200, {
      ballotDefinitions
    });
  }
};
