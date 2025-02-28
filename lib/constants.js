export const apiEndpoint = {
  lookupVoterEmail: "lookupVoterEmail",
  getAffidavitTemplate: "getAffidavitTemplate",
  getBallotDefinition: "getBallotDefinition",
  getBlankBallot: "getBlankBallot",
  getConfigurations: "getConfigurations",
  getElection: "getElection",
  getTestPrintPAge: "getTestPrintPAge",
  lookupVoterByAddress: "lookupVoterByAddress",
  lookupVoterByIDnumber: "lookupVoterByIDnumber",
  lookupVoterBySSN4: "lookupVoterBySSN4",
  postBegin: "postBegin",
  postComplete: "postComplete",
  postIncomplete: "postIncomplete",
  setBallotDefinitions: "setBallotDefinitions",
  setElectionBallots: "setElectionBallots",
  setConfigurations: "setConfigurations",
  setElection: "setElection",
  setElectionVoters: "setElectionVoters",
  uploadBallot: "uploadBallot",
};

export const apiPermission = {
  lookupEmail: "lookupEmail",
  appFunction: "appFunction",
  adminFunction: "adminFunction",
  notAllowed: "notAllowed",
};

export const edfSchema = {
  $ref: "#/definitions/ElectionResults.ElectionReport",
  $schema: "http://json-schema.org/draft-04/schema#",
  definitions: {
    "ElectionResults.AnnotatedString": {
      required: ["@type", "Content"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.AnnotatedString"],
          type: "string",
        },
        Annotation: {
          $ref: "#/definitions/ElectionResults.ShortString",
        },
        Content: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.AnnotatedUri": {
      required: ["@type", "Content"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.AnnotatedUri"],
          type: "string",
        },
        Annotation: {
          $ref: "#/definitions/ElectionResults.ShortString",
        },
        Content: {
          type: "string",
          format: "uri",
        },
      },
      type: "object",
    },
    "ElectionResults.BallotCounts": {
      required: ["@type", "GpUnitId", "Type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.BallotCounts"],
          type: "string",
        },
        BallotsCast: {
          type: "integer",
        },
        BallotsOutstanding: {
          type: "integer",
        },
        BallotsRejected: {
          type: "integer",
        },
        DeviceClass: {
          $ref: "#/definitions/ElectionResults.DeviceClass",
        },
        GpUnitId: {
          type: "string",
          refTypes: [
            "ElectionResults.ReportingDevice",
            "ElectionResults.ReportingUnit",
          ],
        },
        IsSuppressedForPrivacy: {
          type: "boolean",
        },
        OtherType: {
          type: "string",
        },
        Round: {
          type: "integer",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.CountItemType",
        },
      },
      type: "object",
    },
    "ElectionResults.BallotMeasureContest": {
      required: ["@id", "@type", "ElectionDistrictId", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.BallotMeasureContest"],
          type: "string",
        },
        Abbreviation: {
          type: "string",
        },
        BallotSubTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        BallotTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ConStatement: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ContestSelection: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.PartySelection",
              },
              {
                $ref: "#/definitions/ElectionResults.BallotMeasureSelection",
              },
              {
                $ref: "#/definitions/ElectionResults.CandidateSelection",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        EffectOfAbstain: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ElectionDistrictId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        FullText: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        HasRotation: {
          type: "boolean",
        },
        InfoUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          type: "string",
        },
        OtherCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.OtherCounts",
          },
          minItems: 0,
          type: "array",
        },
        OtherType: {
          type: "string",
        },
        OtherVoteVariation: {
          type: "string",
        },
        PassageThreshold: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ProStatement: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        SequenceOrder: {
          type: "integer",
        },
        SubUnitsReported: {
          type: "integer",
        },
        SummaryText: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        TotalSubUnits: {
          type: "integer",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.BallotMeasureType",
        },
        VoteVariation: {
          $ref: "#/definitions/ElectionResults.VoteVariation",
        },
      },
      type: "object",
    },
    "ElectionResults.BallotMeasureSelection": {
      required: ["@id", "@type", "Selection"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.BallotMeasureSelection"],
          type: "string",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        Selection: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        SequenceOrder: {
          type: "integer",
        },
        VoteCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.VoteCounts",
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.BallotMeasureType": {
      enum: ["ballot-measure", "initiative", "other", "recall", "referendum"],
      type: "string",
    },
    "ElectionResults.BallotStyle": {
      required: ["@type", "GpUnitIds"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.BallotStyle"],
          type: "string",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        GpUnitIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.ReportingDevice",
              "ElectionResults.ReportingUnit",
            ],
          },
          minItems: 1,
          type: "array",
        },
        ImageUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        OrderedContent: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.OrderedContest",
              },
              {
                $ref: "#/definitions/ElectionResults.OrderedHeader",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        PartyIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.Candidate": {
      required: ["@id", "@type", "BallotName"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Candidate"],
          type: "string",
        },
        BallotName: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        CampaignSlogan: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        FileDate: {
          type: "string",
          format: "date",
        },
        IsIncumbent: {
          type: "boolean",
        },
        IsTopTicket: {
          type: "boolean",
        },
        PartyId: {
          type: "string",
          refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
        },
        PersonId: {
          type: "string",
          refTypes: ["ElectionResults.Person"],
        },
        PostElectionStatus: {
          $ref: "#/definitions/ElectionResults.CandidatePostElectionStatus",
        },
        PreElectionStatus: {
          $ref: "#/definitions/ElectionResults.CandidatePreElectionStatus",
        },
      },
      type: "object",
    },
    "ElectionResults.CandidateContest": {
      required: ["@id", "@type", "ElectionDistrictId", "Name", "VotesAllowed"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.CandidateContest"],
          type: "string",
        },
        Abbreviation: {
          type: "string",
        },
        BallotSubTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        BallotTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ContestSelection: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.PartySelection",
              },
              {
                $ref: "#/definitions/ElectionResults.BallotMeasureSelection",
              },
              {
                $ref: "#/definitions/ElectionResults.CandidateSelection",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        ElectionDistrictId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        HasRotation: {
          type: "boolean",
        },
        Name: {
          type: "string",
        },
        NumberElected: {
          type: "integer",
        },
        NumberRunoff: {
          type: "integer",
        },
        OfficeIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Office"],
          },
          minItems: 0,
          type: "array",
        },
        OtherCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.OtherCounts",
          },
          minItems: 0,
          type: "array",
        },
        OtherVoteVariation: {
          type: "string",
        },
        PrimaryPartyIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
          },
          minItems: 0,
          type: "array",
        },
        SequenceOrder: {
          type: "integer",
        },
        SubUnitsReported: {
          type: "integer",
        },
        TotalSubUnits: {
          type: "integer",
        },
        VoteVariation: {
          $ref: "#/definitions/ElectionResults.VoteVariation",
        },
        VotesAllowed: {
          type: "integer",
        },
      },
      type: "object",
    },
    "ElectionResults.CandidatePostElectionStatus": {
      enum: [
        "advanced-to-runoff",
        "defeated",
        "projected-winner",
        "winner",
        "withdrawn",
      ],
      type: "string",
    },
    "ElectionResults.CandidatePreElectionStatus": {
      enum: ["filed", "qualified", "withdrawn"],
      type: "string",
    },
    "ElectionResults.CandidateSelection": {
      required: ["@id", "@type"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.CandidateSelection"],
          type: "string",
        },
        CandidateIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Candidate"],
          },
          minItems: 0,
          type: "array",
        },
        EndorsementPartyIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
          },
          minItems: 0,
          type: "array",
        },
        IsWriteIn: {
          type: "boolean",
        },
        SequenceOrder: {
          type: "integer",
        },
        VoteCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.VoteCounts",
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.Coalition": {
      required: ["@id", "@type", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Coalition"],
          type: "string",
        },
        Abbreviation: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Color: {
          $ref: "#/definitions/ElectionResults.HtmlColorString",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        ContestIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.PartyContest",
              "ElectionResults.BallotMeasureContest",
              "ElectionResults.CandidateContest",
              "ElectionResults.RetentionContest",
            ],
          },
          minItems: 0,
          type: "array",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        IsRecognizedParty: {
          type: "boolean",
        },
        LeaderPersonIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Person"],
          },
          minItems: 0,
          type: "array",
        },
        LogoUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        PartyIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
          },
          minItems: 0,
          type: "array",
        },
        PartyScopeGpUnitIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.ReportingDevice",
              "ElectionResults.ReportingUnit",
            ],
          },
          minItems: 0,
          type: "array",
        },
        Slogan: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
      },
      type: "object",
    },
    "ElectionResults.ContactInformation": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.ContactInformation"],
          type: "string",
        },
        AddressLine: {
          items: {
            type: "string",
          },
          minItems: 0,
          type: "array",
        },
        Directions: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Email: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedString",
          },
          minItems: 0,
          type: "array",
        },
        Fax: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedString",
          },
          minItems: 0,
          type: "array",
        },
        Label: {
          type: "string",
        },
        LatLng: {
          $ref: "#/definitions/ElectionResults.LatLng",
        },
        Name: {
          type: "string",
        },
        Phone: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedString",
          },
          minItems: 0,
          type: "array",
        },
        Schedule: {
          items: {
            $ref: "#/definitions/ElectionResults.Schedule",
          },
          minItems: 0,
          type: "array",
        },
        Uri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.CountItemStatus": {
      enum: ["completed", "in-process", "not-processed", "unknown"],
      type: "string",
    },
    "ElectionResults.CountItemType": {
      enum: [
        "absentee",
        "absentee-fwab",
        "absentee-in-person",
        "absentee-mail",
        "early",
        "election-day",
        "other",
        "provisional",
        "seats",
        "total",
        "uocava",
        "write-in",
      ],
      type: "string",
    },
    "ElectionResults.CountStatus": {
      required: ["@type", "Status", "Type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.CountStatus"],
          type: "string",
        },
        OtherType: {
          type: "string",
        },
        Status: {
          $ref: "#/definitions/ElectionResults.CountItemStatus",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.CountItemType",
        },
      },
      type: "object",
    },
    "ElectionResults.DateTimeWithZone": {
      pattern:
        "[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]|(24:00:00))(Z|[+-]((0[0-9]|1[0-3]):[0-5][0-9]|14:00))",
      type: "string",
      format: "date-time",
    },
    "ElectionResults.DayType": {
      enum: [
        "all",
        "friday",
        "monday",
        "saturday",
        "sunday",
        "thursday",
        "tuesday",
        "wednesday",
        "weekday",
        "weekend",
      ],
      type: "string",
    },
    "ElectionResults.DeviceClass": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.DeviceClass"],
          type: "string",
        },
        Manufacturer: {
          type: "string",
        },
        Model: {
          type: "string",
        },
        OtherType: {
          type: "string",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.DeviceType",
        },
      },
      type: "object",
    },
    "ElectionResults.DeviceType": {
      enum: [
        "bmd",
        "dre",
        "manual-count",
        "opscan-central",
        "opscan-precinct",
        "other",
        "unknown",
      ],
      type: "string",
    },
    "ElectionResults.Election": {
      required: [
        "@type",
        "ElectionScopeId",
        "EndDate",
        "Name",
        "StartDate",
        "Type",
      ],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.Election"],
          type: "string",
        },
        BallotCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.BallotCounts",
          },
          minItems: 0,
          type: "array",
        },
        BallotStyle: {
          items: {
            $ref: "#/definitions/ElectionResults.BallotStyle",
          },
          minItems: 0,
          type: "array",
        },
        Candidate: {
          items: {
            $ref: "#/definitions/ElectionResults.Candidate",
          },
          minItems: 0,
          type: "array",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        Contest: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.PartyContest",
              },
              {
                $ref: "#/definitions/ElectionResults.BallotMeasureContest",
              },
              {
                $ref: "#/definitions/ElectionResults.CandidateContest",
              },
              {
                $ref: "#/definitions/ElectionResults.RetentionContest",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        ElectionScopeId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        EndDate: {
          type: "string",
          format: "date",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        OtherType: {
          type: "string",
        },
        StartDate: {
          type: "string",
          format: "date",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.ElectionType",
        },
      },
      type: "object",
    },
    "ElectionResults.ElectionAdministration": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.ElectionAdministration"],
          type: "string",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        ElectionOfficialPersonIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Person"],
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.ElectionReport": {
      required: [
        "@type",
        "Format",
        "GeneratedDate",
        "Issuer",
        "IssuerAbbreviation",
        "SequenceEnd",
        "SequenceStart",
        "Status",
        "VendorApplicationId",
      ],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.ElectionReport"],
          type: "string",
        },
        Election: {
          items: {
            $ref: "#/definitions/ElectionResults.Election",
          },
          minItems: 0,
          type: "array",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        Format: {
          $ref: "#/definitions/ElectionResults.ReportDetailLevel",
        },
        GeneratedDate: {
          $ref: "#/definitions/ElectionResults.DateTimeWithZone",
        },
        GpUnit: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.ReportingDevice",
              },
              {
                $ref: "#/definitions/ElectionResults.ReportingUnit",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        Header: {
          items: {
            $ref: "#/definitions/ElectionResults.Header",
          },
          minItems: 0,
          type: "array",
        },
        IsTest: {
          type: "boolean",
        },
        Issuer: {
          type: "string",
        },
        IssuerAbbreviation: {
          type: "string",
        },
        Notes: {
          type: "string",
        },
        Office: {
          items: {
            $ref: "#/definitions/ElectionResults.Office",
          },
          minItems: 0,
          type: "array",
        },
        OfficeGroup: {
          items: {
            $ref: "#/definitions/ElectionResults.OfficeGroup",
          },
          minItems: 0,
          type: "array",
        },
        Party: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.Party",
              },
              {
                $ref: "#/definitions/ElectionResults.Coalition",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        Person: {
          items: {
            $ref: "#/definitions/ElectionResults.Person",
          },
          minItems: 0,
          type: "array",
        },
        SequenceEnd: {
          type: "integer",
        },
        SequenceStart: {
          type: "integer",
        },
        Status: {
          $ref: "#/definitions/ElectionResults.ResultsStatus",
        },
        TestType: {
          type: "string",
        },
        VendorApplicationId: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.ElectionType": {
      enum: [
        "general",
        "other",
        "partisan-primary-closed",
        "partisan-primary-open",
        "primary",
        "runoff",
        "special",
      ],
      type: "string",
    },
    "ElectionResults.ExternalIdentifier": {
      required: ["@type", "Type", "Value"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.ExternalIdentifier"],
          type: "string",
        },
        Label: {
          type: "string",
        },
        OtherType: {
          type: "string",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.IdentifierType",
        },
        Value: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.GeoSpatialFormat": {
      enum: ["geo-json", "gml", "kml", "shp", "wkt"],
      type: "string",
    },
    "ElectionResults.Header": {
      required: ["@id", "@type", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Header"],
          type: "string",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
      },
      type: "object",
    },
    "ElectionResults.Hours": {
      required: ["@type", "EndTime", "StartTime"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.Hours"],
          type: "string",
        },
        Day: {
          $ref: "#/definitions/ElectionResults.DayType",
        },
        EndTime: {
          $ref: "#/definitions/ElectionResults.TimeWithZone",
        },
        Label: {
          type: "string",
        },
        StartTime: {
          $ref: "#/definitions/ElectionResults.TimeWithZone",
        },
      },
      type: "object",
    },
    "ElectionResults.HtmlColorString": {
      pattern: "[0-9a-f]{6}",
      type: "string",
    },
    "ElectionResults.IdentifierType": {
      enum: [
        "fips",
        "local-level",
        "national-level",
        "ocd-id",
        "other",
        "state-level",
      ],
      type: "string",
    },
    "ElectionResults.InternationalizedText": {
      required: ["@type", "Text"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.InternationalizedText"],
          type: "string",
        },
        Label: {
          type: "string",
        },
        Text: {
          items: {
            $ref: "#/definitions/ElectionResults.LanguageString",
          },
          minItems: 1,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.LanguageString": {
      required: ["@type", "Content", "Language"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.LanguageString"],
          type: "string",
        },
        Content: {
          type: "string",
        },
        Language: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.LatLng": {
      required: ["@type", "Latitude", "Longitude"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.LatLng"],
          type: "string",
        },
        Label: {
          type: "string",
        },
        Latitude: {
          type: "number",
        },
        Longitude: {
          type: "number",
        },
        Source: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.Office": {
      required: ["@id", "@type", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Office"],
          type: "string",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        Description: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ElectionDistrictId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        FilingDeadline: {
          type: "string",
          format: "date",
        },
        IsPartisan: {
          type: "boolean",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        OfficeHolderPersonIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Person"],
          },
          minItems: 0,
          type: "array",
        },
        Term: {
          $ref: "#/definitions/ElectionResults.Term",
        },
      },
      type: "object",
    },
    "ElectionResults.OfficeGroup": {
      required: ["@type", "Name"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.OfficeGroup"],
          type: "string",
        },
        Label: {
          type: "string",
        },
        Name: {
          type: "string",
        },
        OfficeIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Office"],
          },
          minItems: 0,
          type: "array",
        },
        SubOfficeGroup: {
          items: {
            $ref: "#/definitions/ElectionResults.OfficeGroup",
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.OfficeTermType": {
      enum: ["full-term", "unexpired-term"],
      type: "string",
    },
    "ElectionResults.OrderedContest": {
      required: ["@type", "ContestId"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.OrderedContest"],
          type: "string",
        },
        ContestId: {
          type: "string",
          refTypes: [
            "ElectionResults.PartyContest",
            "ElectionResults.BallotMeasureContest",
            "ElectionResults.CandidateContest",
            "ElectionResults.RetentionContest",
          ],
        },
        OrderedContestSelectionIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.PartySelection",
              "ElectionResults.BallotMeasureSelection",
              "ElectionResults.CandidateSelection",
            ],
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.OrderedHeader": {
      required: ["@type", "HeaderId"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.OrderedHeader"],
          type: "string",
        },
        HeaderId: {
          type: "string",
          refTypes: ["ElectionResults.Header"],
        },
        OrderedContent: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.OrderedContest",
              },
              {
                $ref: "#/definitions/ElectionResults.OrderedHeader",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.OtherCounts": {
      required: ["@type", "GpUnitId"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.OtherCounts"],
          type: "string",
        },
        DeviceClass: {
          $ref: "#/definitions/ElectionResults.DeviceClass",
        },
        GpUnitId: {
          type: "string",
          refTypes: [
            "ElectionResults.ReportingDevice",
            "ElectionResults.ReportingUnit",
          ],
        },
        Overvotes: {
          type: "number",
        },
        Undervotes: {
          type: "number",
        },
        WriteIns: {
          type: "integer",
        },
      },
      type: "object",
    },
    "ElectionResults.Party": {
      required: ["@id", "@type", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Party"],
          type: "string",
        },
        Abbreviation: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Color: {
          $ref: "#/definitions/ElectionResults.HtmlColorString",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        IsRecognizedParty: {
          type: "boolean",
        },
        LeaderPersonIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Person"],
          },
          minItems: 0,
          type: "array",
        },
        LogoUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        PartyScopeGpUnitIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.ReportingDevice",
              "ElectionResults.ReportingUnit",
            ],
          },
          minItems: 0,
          type: "array",
        },
        Slogan: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
      },
      type: "object",
    },
    "ElectionResults.PartyContest": {
      required: ["@id", "@type", "ElectionDistrictId", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.PartyContest"],
          type: "string",
        },
        Abbreviation: {
          type: "string",
        },
        BallotSubTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        BallotTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ContestSelection: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.PartySelection",
              },
              {
                $ref: "#/definitions/ElectionResults.BallotMeasureSelection",
              },
              {
                $ref: "#/definitions/ElectionResults.CandidateSelection",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        ElectionDistrictId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        HasRotation: {
          type: "boolean",
        },
        Name: {
          type: "string",
        },
        OtherCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.OtherCounts",
          },
          minItems: 0,
          type: "array",
        },
        OtherVoteVariation: {
          type: "string",
        },
        SequenceOrder: {
          type: "integer",
        },
        SubUnitsReported: {
          type: "integer",
        },
        TotalSubUnits: {
          type: "integer",
        },
        VoteVariation: {
          $ref: "#/definitions/ElectionResults.VoteVariation",
        },
      },
      type: "object",
    },
    "ElectionResults.PartyRegistration": {
      required: ["@type", "Count", "PartyId"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.PartyRegistration"],
          type: "string",
        },
        Count: {
          type: "integer",
        },
        PartyId: {
          type: "string",
          refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
        },
      },
      type: "object",
    },
    "ElectionResults.PartySelection": {
      required: ["@id", "@type", "PartyIds"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.PartySelection"],
          type: "string",
        },
        PartyIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
          },
          minItems: 1,
          type: "array",
        },
        SequenceOrder: {
          type: "integer",
        },
        VoteCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.VoteCounts",
          },
          minItems: 0,
          type: "array",
        },
      },
      type: "object",
    },
    "ElectionResults.Person": {
      required: ["@id", "@type"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.Person"],
          type: "string",
        },
        ContactInformation: {
          items: {
            $ref: "#/definitions/ElectionResults.ContactInformation",
          },
          minItems: 0,
          type: "array",
        },
        DateOfBirth: {
          type: "string",
          format: "date",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        FirstName: {
          type: "string",
        },
        FullName: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Gender: {
          type: "string",
        },
        LastName: {
          type: "string",
        },
        MiddleName: {
          items: {
            type: "string",
          },
          minItems: 0,
          type: "array",
        },
        Nickname: {
          type: "string",
        },
        PartyId: {
          type: "string",
          refTypes: ["ElectionResults.Party", "ElectionResults.Coalition"],
        },
        Prefix: {
          type: "string",
        },
        Profession: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Suffix: {
          type: "string",
        },
        Title: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
      },
      type: "object",
    },
    "ElectionResults.ReportDetailLevel": {
      enum: ["precinct-level", "summary-contest"],
      type: "string",
    },
    "ElectionResults.ReportingDevice": {
      required: ["@id", "@type"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.ReportingDevice"],
          type: "string",
        },
        ComposingGpUnitIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.ReportingDevice",
              "ElectionResults.ReportingUnit",
            ],
          },
          minItems: 0,
          type: "array",
        },
        DeviceClass: {
          $ref: "#/definitions/ElectionResults.DeviceClass",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        SerialNumber: {
          type: "string",
        },
      },
      type: "object",
    },
    "ElectionResults.ReportingUnit": {
      required: ["@id", "@type", "Type"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.ReportingUnit"],
          type: "string",
        },
        AuthorityIds: {
          items: {
            type: "string",
            refTypes: ["ElectionResults.Person"],
          },
          minItems: 0,
          type: "array",
        },
        ComposingGpUnitIds: {
          items: {
            type: "string",
            refTypes: [
              "ElectionResults.ReportingDevice",
              "ElectionResults.ReportingUnit",
            ],
          },
          minItems: 0,
          type: "array",
        },
        ContactInformation: {
          $ref: "#/definitions/ElectionResults.ContactInformation",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        ElectionAdministration: {
          $ref: "#/definitions/ElectionResults.ElectionAdministration",
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        IsDistricted: {
          type: "boolean",
        },
        IsMailOnly: {
          type: "boolean",
        },
        Name: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        Number: {
          type: "string",
        },
        OtherType: {
          type: "string",
        },
        PartyRegistration: {
          items: {
            $ref: "#/definitions/ElectionResults.PartyRegistration",
          },
          minItems: 0,
          type: "array",
        },
        SpatialDimension: {
          $ref: "#/definitions/ElectionResults.SpatialDimension",
        },
        SubUnitsReported: {
          type: "integer",
        },
        TotalSubUnits: {
          type: "integer",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.ReportingUnitType",
        },
        VotersParticipated: {
          type: "integer",
        },
        VotersRegistered: {
          type: "integer",
        },
      },
      type: "object",
    },
    "ElectionResults.ReportingUnitType": {
      enum: [
        "ballot-batch",
        "ballot-style-area",
        "borough",
        "city",
        "city-council",
        "combined-precinct",
        "congressional",
        "country",
        "county",
        "county-council",
        "drop-box",
        "judicial",
        "municipality",
        "other",
        "polling-place",
        "precinct",
        "school",
        "special",
        "split-precinct",
        "state",
        "state-house",
        "state-senate",
        "town",
        "township",
        "utility",
        "village",
        "vote-center",
        "ward",
        "water",
      ],
      type: "string",
    },
    "ElectionResults.ResultsStatus": {
      enum: [
        "certified",
        "correction",
        "pre-election",
        "recount",
        "unofficial-complete",
        "unofficial-partial",
      ],
      type: "string",
    },
    "ElectionResults.RetentionContest": {
      required: ["@id", "@type", "CandidateId", "ElectionDistrictId", "Name"],
      additionalProperties: false,
      properties: {
        "@id": {
          type: "string",
        },
        "@type": {
          enum: ["ElectionResults.RetentionContest"],
          type: "string",
        },
        Abbreviation: {
          type: "string",
        },
        BallotSubTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        BallotTitle: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        CandidateId: {
          type: "string",
          refTypes: ["ElectionResults.Candidate"],
        },
        ConStatement: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ContestSelection: {
          items: {
            oneOf: [
              {
                $ref: "#/definitions/ElectionResults.PartySelection",
              },
              {
                $ref: "#/definitions/ElectionResults.BallotMeasureSelection",
              },
              {
                $ref: "#/definitions/ElectionResults.CandidateSelection",
              },
            ],
          },
          minItems: 0,
          type: "array",
        },
        CountStatus: {
          items: {
            $ref: "#/definitions/ElectionResults.CountStatus",
          },
          minItems: 0,
          type: "array",
        },
        EffectOfAbstain: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ElectionDistrictId: {
          type: "string",
          refTypes: ["ElectionResults.ReportingUnit"],
        },
        ExternalIdentifier: {
          items: {
            $ref: "#/definitions/ElectionResults.ExternalIdentifier",
          },
          minItems: 0,
          type: "array",
        },
        FullText: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        HasRotation: {
          type: "boolean",
        },
        InfoUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        Name: {
          type: "string",
        },
        OfficeId: {
          type: "string",
          refTypes: ["ElectionResults.Office"],
        },
        OtherCounts: {
          items: {
            $ref: "#/definitions/ElectionResults.OtherCounts",
          },
          minItems: 0,
          type: "array",
        },
        OtherType: {
          type: "string",
        },
        OtherVoteVariation: {
          type: "string",
        },
        PassageThreshold: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        ProStatement: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        SequenceOrder: {
          type: "integer",
        },
        SubUnitsReported: {
          type: "integer",
        },
        SummaryText: {
          $ref: "#/definitions/ElectionResults.InternationalizedText",
        },
        TotalSubUnits: {
          type: "integer",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.BallotMeasureType",
        },
        VoteVariation: {
          $ref: "#/definitions/ElectionResults.VoteVariation",
        },
      },
      type: "object",
    },
    "ElectionResults.Schedule": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.Schedule"],
          type: "string",
        },
        EndDate: {
          type: "string",
          format: "date",
        },
        Hours: {
          items: {
            $ref: "#/definitions/ElectionResults.Hours",
          },
          minItems: 0,
          type: "array",
        },
        IsOnlyByAppointment: {
          type: "boolean",
        },
        IsOrByAppointment: {
          type: "boolean",
        },
        IsSubjectToChange: {
          type: "boolean",
        },
        Label: {
          type: "string",
        },
        StartDate: {
          type: "string",
          format: "date",
        },
      },
      type: "object",
    },
    "ElectionResults.ShortString": {
      maxLength: 32,
      type: "string",
    },
    "ElectionResults.SpatialDimension": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.SpatialDimension"],
          type: "string",
        },
        MapUri: {
          items: {
            $ref: "#/definitions/ElectionResults.AnnotatedUri",
          },
          minItems: 0,
          type: "array",
        },
        SpatialExtent: {
          $ref: "#/definitions/ElectionResults.SpatialExtent",
        },
      },
      type: "object",
    },
    "ElectionResults.SpatialExtent": {
      required: ["@type", "Coordinates", "Format"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.SpatialExtent"],
          type: "string",
        },
        Coordinates: {
          type: "string",
        },
        Format: {
          $ref: "#/definitions/ElectionResults.GeoSpatialFormat",
        },
      },
      type: "object",
    },
    "ElectionResults.Term": {
      required: ["@type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.Term"],
          type: "string",
        },
        EndDate: {
          type: "string",
          format: "date",
        },
        Label: {
          type: "string",
        },
        StartDate: {
          type: "string",
          format: "date",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.OfficeTermType",
        },
      },
      type: "object",
    },
    "ElectionResults.TimeWithZone": {
      pattern:
        "(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]|(24:00:00))(Z|[+-]((0[0-9]|1[0-3]):[0-5][0-9]|14:00))",
      type: "string",
      format: "time",
    },
    "ElectionResults.VoteCounts": {
      required: ["@type", "Count", "GpUnitId", "Type"],
      additionalProperties: false,
      properties: {
        "@type": {
          enum: ["ElectionResults.VoteCounts"],
          type: "string",
        },
        Count: {
          type: "number",
        },
        DeviceClass: {
          $ref: "#/definitions/ElectionResults.DeviceClass",
        },
        GpUnitId: {
          type: "string",
          refTypes: [
            "ElectionResults.ReportingDevice",
            "ElectionResults.ReportingUnit",
          ],
        },
        IsSuppressedForPrivacy: {
          type: "boolean",
        },
        OtherType: {
          type: "string",
        },
        Round: {
          type: "integer",
        },
        Type: {
          $ref: "#/definitions/ElectionResults.CountItemType",
        },
      },
      type: "object",
    },
    "ElectionResults.VoteVariation": {
      enum: [
        "approval",
        "borda",
        "cumulative",
        "majority",
        "n-of-m",
        "other",
        "plurality",
        "proportional",
        "range",
        "rcv",
        "super-majority",
      ],
      type: "string",
    },
  },
};
