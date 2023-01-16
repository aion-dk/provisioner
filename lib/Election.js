const DB = require("./db");
const { Application } = require("./Application");
const prepareVoterRecord = require("./prepareVoterRecord.js");
const AWS = require("aws-sdk");
const { FileServer } = require("./FileServer.js")

const db = new DB();

let tableName = process.env.ELECTIONS_TABLE_NAME;
let voterTableName = process.env.VOTERS_TABLE_NAME;
let documentBucket = process.env.ELECTIONS_DOCUMENT_BUCKET;
let uploadBucket = process.env.UPLOAD_BUCKET;

if (process.env.AWS_SAM_LOCAL) {
  tableName = `abc_elections_local`;
  voterTableName = "abc_voters_local";
}

const affidavitFile = "blank_affidavit.pdf";
const defaultTestPrintFile = "MarkitTestPrintPage.pdf";

class Election {
  static servingStatus = {
    closed: "closed",
    open: "open",
    lookup: "lookup",
  };

  static electionStatus = {
    pending: "pending",
    test: "test",
    live: "live",
    complete: "complete",
    archived: "archived",
  };

  static consumerProperties = [
    "electionId",
    "electionJurisdictionName",
    "electionName",
    "electionStatus",
    "servingStatus",
    "electionDate",
    "testCount",
    //"electionLink",
    "electionVotingStartDate",
    "electionDefinitionURL",
    "ballotDefinitions",
  ];

  static objectProperties = [
    "electionId",
    "electionJurisdictionName",
    "electionName",
    "electionStatus",
    "electionDate",
    //"electionLink",
    "electionVotingStartDate",

    "voterCount",
    "testVoterCount",
    "ballotDefinitionCount",
    "ballotCount",

    "configurations",
    "ballotDefinitions",
    "testPrintPageFilename",
    "testCount",
    "electionStatus",
    "servingStatus",
    "configStatus",
    "latMode",
    "electionDefinitionFile",
    "electionDefinitionURL",
    "edfSet",
    "ballotsSet",
    "votersSet",
    "testVotersSet",
    "ballotsFile",
    "votersFile",
  ];

  static defaultAttributes = {
    voterCount: 0,
    testVoterCount: 0,
    ballotDefinitionCount: 0,
    ballotDefinitions: {},
    ballotCount: 0,
    electionStatus: this.electionStatus.pending,
    configStatus: "incomplete",
    servingStatus: this.servingStatus.closed,
    edfSet: false,
    ballotsSet: false,
    votersSet: false,
    testVotersSet: false,
  };

  static noElectionResponse = {
    statusCode: 400,
    body: JSON.stringify(
      {
        error_type: "no_election",
        error_description: `No current election`,
      },
      null,
      2
    ),
  };

  /*static filterProperties(attributes, master) {
    return Object.keys(attributes)
      .filter((key) => master.includes(key))
      .reduce((obj, key) => {
        obj[key] = attributes[key];
        return obj;
      }, {});
  }
  */

  static filterProperties(attributes, master) {
    return Object.keys(attributes)
      .filter((key) => master.includes(key))
      .reduce((obj, key) => {
        obj[key] = attributes[key];
        return obj;
      }, {});
  }

  static filterNullExtendProperties(
    attributes,
    master = Election.objectProperties
  ) {
    return master.reduce((obj, key) => {
      obj[key] = attributes[key] != null ? attributes[key] : null;
      return obj;
    }, {});
  }

  static insureProperAttributeFormat(attributes) {
    const formattedAttribtues = {};
    for (const key in attributes) {
      switch (key) {
        case "electionDate":
        case "electionVotingStartDate":
          formattedAttribtues[key] = attributes[key].split("T")[0];
          break;

        default:
          formattedAttribtues[key] = attributes[key];
          break;
      }
    }
    return formattedAttribtues;
  }
  static filterConsumerProperties(attributes) {
    const preparedAttributes = Election.insureProperAttributeFormat(attributes);
    return this.filterNullExtendProperties(
      preparedAttributes,
      Election.consumerProperties
    );
  }

  static filterObjectProperties(attributes) {
    return this.filterProperties(attributes, Election.objectProperties);
  }

  constructor(attributes, admin = false) {
    this.allAttributes = attributes;
    if (admin) {
      this.attributes = attributes;
    } else {
      this.attributes = Election.filterConsumerProperties(attributes);
    }
  }

  static dummyBallotDefinition = { Lots: "Interesting JSON or XML" };

  static async all() {
    const data = await db.getAll(null, tableName);
    if (data && data.Items) {
      return data.Items.map((dataItem) => new Election(dataItem));
    } else {
      return [];
    }
  }

  static async findByElectionId(electionId) {
    const data = await db.get(
      {
        electionId: electionId,
      },
      tableName
    );

    return data ? new Election(data, true) : null;
  }

  static async currentElection(latMode) {
    const electionId = await Application.get("currentElectionId");

    if (electionId) {
      const election = await Election.findByElectionId(electionId);
      if (election && election.attributes.latMode == latMode) {
        return election;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static respondIfNoElection() {
    if (!this.currentElection()) {
      return noElectionResponse;
    }
  }

  static initDefaults(attributes, id) {
    return Object.assign(
      {},
      { electionId: id },
      this.defaultAttributes,
      attributes
    );
  }

  static async create(attributes, id) {
    attributes = Election.filterObjectProperties(attributes);
    attributes = this.initDefaults(attributes, id);
    attributes = Election.insureProperAttributeFormat(attributes);
    const data = await db.put(attributes, tableName);
    return data ? new Election(attributes, true) : null;
  }

  async update(attributes) {
    attributes = Election.filterObjectProperties(attributes);
    attributes = Election.insureProperAttributeFormat(attributes);
    delete attributes.electionId;
    const newAttributes = await db.update(
      attributes,
      { electionId: this.attributes.electionId },
      tableName
    );
    this.attributes = newAttributes;
    return this;
  }

  getBallotDefinitions() {
    return this.attributes.ballotDefinitions
  }

  async updateBallotDefinitions(ballotDefinitions) {
    console.log('Merging these ballot definitions:')
    console.log(ballotDefinitions)
    console.log('Into existing:')
    console.log(this.attributes.ballotDefinitions)
    const newAttributes = {...this.attributes}
    newAttributes.ballotDefinitions = {...this.attributes.ballotDefinitions, ...ballotDefinitions}
    console.log('New attributes:')
    console.log(newAttributes.ballotDefinitions)
    await this.update(newAttributes)
    console.log('After update:')
    console.log(this.attributes.ballotDefinitions)
  }

  configurations() {
    if (this.allAttributes) {
      return JSON.parse(this.allAttributes.configurations);
    }
  }

  async insertVoterRecord(record) {
    return await db.put(record, voterTableName);
  }

  prepareVoterRecordForDB = (record, latMode = 0) => {
    record["LAT"] = latMode;
    record["electionId"] = this.allAttributes["electionId"];
    record["completedN"] = "0";
    record["incompletedN"] = "0";
    const dbRecord = prepareVoterRecord(record);

    return dbRecord;
  };

  async loadVoterRecords(voterList) {
    let myReadPromise = new Promise(async (resolve, reject) => {
      let voterCount = 0;

      voterList.forEach(async (voter) => {
        await this.insertVoterRecord(
          this.prepareVoterRecordForDB(voter, false)
        );

        voterCount += 1;
        await this.update({
          voterCount,
        });
      });

      resolve();
    });
    try {
      await myReadPromise;
    } catch (err) {
      console.log("an error has occurred");
    }

    console.log("done reading!");
  }

  async setElectionVoters(voterList) {
    try {
      await this.loadVoterRecords(voterList);
      await this.update({ votersSet: true });

      return [true, voterList.length];
    } catch (err) {
      console.log("Caught error: " + err);
      return [false, JSON.stringify(err)];
    }
  }

  // await this.update({
  //   ballotsSet: true,
  //   ballotCount: documentState["fileCount"],
  // });

  affidavitTemplateURL() {
    if (this.attributes) {
      return FileServer.genUrl(affidavitFile);
    }
  }

  electionDefinitionURL() {
    if (this.attributes) {
      return this.attributes["electionDefinitionURL"];
    }
  }

  testPrintPageURL() {
    if (this.attributes) {
      return Election.generateURL(
        this.attributes["testPrintPageFilename"]
          ? this.attributes["testPrintPageFilename"]
          : defaultTestPrintFile
      );
    }
  }

  blankBallotURL(voter) {
    if (this.attributes) {
      return FileServer.genUrl(`${voter.attributes["ballotID"]}.pdf`);
    }
  }
}

exports.Election = Election;
