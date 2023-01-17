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
    "ballotFiles",
    "ballotFilesCount",
    "electionDefinitionCount"
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

    "ballotFiles",
    "ballotFilesCount",
    "electionDefinitionCount",

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
    ballotCount: 0,
    electionStatus: this.electionStatus.pending,
    configStatus: "incomplete",
    servingStatus: this.servingStatus.closed,
    edfSet: false,
    ballotsSet: false,
    votersSet: false,
    testVotersSet: false,
    configurations: {}
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
    console.log(electionId)

    if (electionId) {
      return await Election.findByElectionId(electionId);
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

  async updateBallotFiles(ballotFiles) {
    const newAttributes = {...this.attributes}
    newAttributes.ballotFiles = {
      ...this.attributes.ballotFiles,
      ...ballotFiles,
    }
    newAttributes.ballotFilesCount = Object.keys(newAttributes.ballotFiles).length
    newAttributes["ballotsSet"] = true

    await this.update(newAttributes)
  }

  configurations() {
    if (this.allAttributes) {
      return this.allAttributes.configurations;
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
      await this.update({
        votersSet: true,
        voterCount: voterList.length
      });

      return [true, voterList.length];
    } catch (err) {
      console.log("Caught error: " + err);
      return [false, JSON.stringify(err)];
    }
  }

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
