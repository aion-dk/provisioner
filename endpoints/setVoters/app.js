const {
  Voter,
  Election,
  ApiResponse,
  ApiRequire,
  FileServer,
} = require("/opt/Common");

const setElectionVoters = async (election, voterList) => {
  voterList.forEach((entry) => {
    await Voter.create(
      Object.assign(entry, { electionId: election.electionId })
    )
  })
}

exports.lambdaHandler = async (event, context, callback) => {
  const requiredArgs = ["electionId", "voterList"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }
  const { electionId, voterList } = messageBody;

  if (electionId) {
    const election = await Election.findByElectionId(electionId);

    if (election) {
      await setElectionVoters(election, voterList);
      return ApiResponse.makeResponse(200);
    } else {
      return ApiResponse.noMatchingElection(electionId);
    }
  }
};
