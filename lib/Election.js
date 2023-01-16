const DB = require("./db");
const { Application } = require("./Application");
const { FileInProcessing } = require("./FileInProcessing.js");
const DocumentInterface = require("./documentinterface.js");
const prepareVoterRecord = require("./prepareVoterRecord.js");
const readline = require("readline");
const AWS = require("aws-sdk");
let s3 = new AWS.S3({ signatureVersion: "v4" });

const db = new DB();

//const uuid = require("uuid");

let tableName = process.env.ELECTIONS_TABLE_NAME;
let voterTableName = process.env.VOTERS_TABLE_NAME;
let documentBucket = process.env.ELECTIONS_DOCUMENT_BUCKET;
let uploadBucket = process.env.UPLOAD_BUCKET;
let documentBase;

if (process.env.AWS_SAM_LOCAL) {
  tableName = `abc_elections_local`;
  voterTableName = "abc_voters_local";
  // Allow local dev override
  //documentBucket = "";
  //uploadBucket = "";
  documentBase = `https://somewhere.com/docs/`;
}
const dummyConfiguration = {
  stateName: "DemoState",
  stateCode: "DS",
  absenteeStatusRequired: true,
  multipleUsePermitted: true,
  multipleUseNotification: "lorem ipsum",
  affidavitOfferSignatureViaPhoto: true,
  affidavitOfferSignatureViaName: true,
  affidavitRequiresWitnessName: true,
  affidavitRequiresWitnessSignature: true,
  affidavitRequiresDLIDcardPhotos: true,
  DLNminLength: 6,
  DLNmaxLength: 6,
  DLNalpha: true,
  DLNnumeric: true,
  DLNexample: "C46253",
  linkAbsenteeRequests: "http://absenteerequest.tbd.com",
  linkVoterReg: "http://voterreg.tbd.com",
  linkBallotReturn: "http://ballotreturn.tbd.com",
  linkMoreInfo1: "http://misc1.tbd.com",
  linkMoreInfo2: "http://misc2.tbd.com",
};

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
    //Temporary set EDF URL
    // Only initialize this if not already set
    if (!attributes["electionDefinitionURL"]) {
      this.allAttributes["electionDefinitionURL"] = Election.generateURL(
        this.allAttributes["electionId"] + "_edf.json"
      );
      this.attributes["electionDefinitionURL"] =
        this.allAttributes["electionDefinitionURL"];
    }
  }

  static docBaseURL = documentBase; //"https://somewhere.com/";
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

  getBallotFiles() {
    return this.attributes.ballotFiles
  }

  async updateBallotFiles(ballotFiles) {
    console.log('Merging these ballot definitions:')
    console.log(ballotFiles)
    console.log('Into existing:')
    console.log(this.attributes.ballotFiles)
    console.log('Count before:' + this.attributes.ballotFilesCount)
    const newAttributes = {...this.attributes}
    newAttributes.ballotFiles = {...this.attributes.ballotFiles, ...ballotFiles}
    newAttributes.ballotFilesCount = Object.keys(newAttributes.ballotFiles).length
    console.log('New attributes:')
    console.log(newAttributes.ballotFiles)
    await this.update(newAttributes)
    console.log('After update:')
    console.log(this.attributes.ballotFiles)
    console.log('Count after:' + this.attributes.ballotFilesCount)
  }

  configurations() {
    if (this.allAttributes) {
      return JSON.parse(this.allAttributes.configurations);
    }
  }

  /* async electionDefinition() {
    if (this.allAttributes && this.allAttributes.electionDefinitionFile) {
      console.log("Retrieving file");
      const [success, response] = await DocumentInterface.getFile(
        uploadBucket,
        this.allAttributes.electionDefinitionFile
      );

      if (success) {
        //To do check the status of this EDF first?
        //Currently not...
        return JSON.parse(response.Body.toString("ascii"));
      } else {
        console.log("Failed");
        return {};
      }
    } else {
      return {};
    }
  }
  */

  static generateURL(filename) {
    const contentType = filename.endsWith("json")
      ? "application/json"
      : "application/pdf";
    if (documentBucket) {
      return DocumentInterface.getSignedUrl(
        documentBucket,
        filename,
        120,
        "inline;",
        contentType
      );
    } else {
      return Election.docBaseURL + filename;
    }
  }

  async startEDFSubmission(
    fileKey,
    data,
    status = "started",
    errorMessage = ""
  ) {
    const [success, message] = await DocumentInterface.createFile(
      uploadBucket,
      fileKey,
      data
    );
    if (success) {
      const [processSuccess, processingMessage] =
        await FileInProcessing.initiate(
          fileKey,
          "edfSubmission",
          status,
          errorMessage
        );
      if (processSuccess) {
        return [true, ""];
      } else {
        return [false, processingMessage];
      }
    } else {
      return [false, message];
    }
  }

  async initiateEDFSubmission(fileKey, status = "started", errorMessage = "") {
    // TODO: Removed S3 interactions
    const [success, message] = [true, ""];
    // const [success, message] = await DocumentInterface.getFile(
    //   uploadBucket,
    //   fileKey
    // );
    if (success) {
      const [processSuccess, processingMessage] =
        await FileInProcessing.initiate(
          fileKey,
          FileInProcessing.requestType.edfSubmission,
          status,
          errorMessage
        );
      if (processSuccess) {
        return [true, ""];
      } else {
        return [false, processingMessage];
      }
    } else {
      return [false, message];
    }
  }

  async setElectionDefinition(objectId, documentState) {
    this.ballotDefinition
  }

  async setElectionDefinition(objectId, documentState) {
    if (documentState["fileCount"] == 1) {
      await FileInProcessing.initiate(
        objectId,
        FileInProcessing.requestType.edfSubmission,
        FileInProcessing.processingStatus.started,
        "EDF initiated for electionId: " + this.attributes.electionId
      );
      await this.update({
        electionDefinitionFile: objectId,
      });

      const s3Config = {
        Bucket: uploadBucket,
        Key: Object.values(documentState["files"])[0],
      };

      const readFile = new Promise((resolve, reject) => {
        s3.getObject(s3Config, (err, data) => {
          if (err) {
            console.log(err, err.stack);
            resolve();
          } else {
            try {
              var txt = data.Body.toString("ascii");
              var json = JSON.parse(txt);
              var ballotStyleCount = json["Election"][0]["BallotStyle"].length;
              this.update({
                ballotDefinitionCount: ballotStyleCount,
              }).then(() => {
                resolve();
              });
            } catch (err) {
              console.log(err.message);
              console.log("error parsing EDF text");
              resolve();
            }
          }
        });
      });
      await readFile;

      const [success, message] = await DocumentInterface.copyFile(
        uploadBucket,
        documentBucket,
        Object.values(documentState["files"])[0],
        this.allAttributes["electionId"] + "_edf.json"
      );
      if (success) {
        await FileInProcessing.incrementProgress(
          objectId,
          FileInProcessing.processingStatus.complete.toString(),
          "EDF loaded to electionId: " + this.attributes.electionId,
          "edfSubmission"
        );
        await this.update({ edfSet: true });

        return [true, ""];
      } else {
        return [false, message];
      }
    } else {
      return [false, "Multiple files uploaded"];
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

      for (const voter in voterList) {
        await this.insertVoterRecord(
          this.prepareVoterRecordForDB(voter, latMode)
        );

        voterCount += 1;
        await this.update({
          voterCount,
        });
      };

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
      console.log("Attempting to load JSON records..........");
      await this.loadVoterRecords(voterList);
      await this.update({ votersSet: true });
      console.log("Finished loading records.........")

      return [true, JSON.stringify(response)];
    } catch (err) {
      console.log("Caught error: " + err);
      return [false, JSON.stringify(err)];
    }
  }

  async setElectionBallots(objectId, documentState) {
    await FileInProcessing.initiate(
      objectId,
      FileInProcessing.requestType.ballotsSubmission.toString(),
      FileInProcessing.processingStatus.started.toString(),
      "Ballot File initiated for electionId: " + this.attributes.electionId
    );

    await this.update({
      ballotsFile: objectId,
    });

    var functionSuccess = true,
      functionMessage = "";
    var ballotsUploaded = 0;
    for (const key in documentState["files"]) {
      const value = documentState["files"][key];
      const [success, message] = await DocumentInterface.copyFile(
        uploadBucket,
        documentBucket,
        value,
        this.allAttributes["electionId"] + "_" + key
      );
      functionSuccess = functionSuccess && success;
      functionMessage = functionMessage + message + " ";
      ballotsUploaded += 1;
    }
    if (functionSuccess) {
      await this.update({
        ballotsSet: true,
        ballotCount: documentState["fileCount"],
      });
      await FileInProcessing.incrementProgress(
        objectId,
        FileInProcessing.processingStatus.complete.toString(),
        "Ballots loaded to electionId: " + this.attributes.electionId,
        FileInProcessing.requestType.ballotsSubmission.toString()
      );
      return [true, ""];
    } else {
      return [false, functionMessage];
    }
  }

  affidavitTemplateURL() {
    if (this.attributes) {
      return Election.generateURL(affidavitFile);
    }
  }

  electionDefinitionURL() {
    if (this.attributes) {
      // return this.allAttributes["electionDefinitionURL"];
      return this.attributes["electionDefinitionURL"];
      //return Election.generateURL(this.allAttributes.electionDefinitionFile);
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

  //Alex:  query best practices on these attribute references
  //  more important in future when not dummy function.

  blankBallotURL(voter) {
    if (this.attributes) {
      let ballotFile = this.attributes["electionId"]
        .toLowerCase()
        .replace(/\s/g, "_");
      ballotFile += "_" + voter.attributes["ballotID"] + ".pdf";
      return Election.generateURL(ballotFile);
    }
  }
}

exports.Election = Election;
