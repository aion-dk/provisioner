const {
  Voter,
  Election,
  ApiResponse,
  ApiRequire,
  DocumentInterface,
} = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  const requiredArgs = ["electionId", "voterList"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { electionId, voterList } = messageBody;

  const election = await Election.findByElectionId(electionId);
  if (!election) {
    return ApiResponse.noMatchingElection(electionId);
  } else {
    const [success, voterCount] = await election.setElectionVoters(voterList);

    if (success) {
      return ApiResponse.makeResponse(200, {
        voterCount: voterCount
      });
    } else {
      return ApiResponse.makeFullErrorResponse("file-error", message);
    }
  }
};
