import {
  Button,
  Grid,
  Step,
  StepButton,
  Stepper,
  Typography,
  Switch,
  InputLabel,
} from "@mui/material";
import {
  Election,
  ElectionConfiguration,
  ElectionCreate,
  ElectionStatus,
  Maybe,
} from "types";

import ConstructionIcon from "@mui/icons-material/Construction";

import Input from "component/Input";
import DatePicker from "component/DatePicker";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CheckIcon from "@mui/icons-material/Check";
import { ReactNode, useCallback, useEffect, useState } from "react";

import {
  setTestVoterFile,
  setElectionAttributes,
  createElection,
  getElection,
  setElectionConfigurations,
  setElectionDefinition,
  setElectionVoters,
  setBallotDefinitions,
} from "requests/election";
import { useRouter } from "next/router";
import InputSwitch from "./InputSwitch";
import FileUpload from "./FileUpload";
import CompletedCheckbox from "./CompletedCheckbox";
import ElectionCard from "./ElectionCard";
import GC from "./GC";
import GI from "./GI";
import { Box } from "@mui/system";
import Loading from "./Loading";
import { formatTimeStamp } from "dsl/date";

interface ElectionFormProps {
  election: Maybe<Election>;
  onUpdateElection(election: Election): void;
  title: string;
}

export default function ElectionForm({
  election,
  onUpdateElection,
  title,
}: ElectionFormProps) {

  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<Maybe<Election | ElectionCreate>>(election);
  const [edfUid, setEDFUid] = useState<string>(
    election?.electionDefinitionFile || ""
  );
  const [edfStatus, setEDFStatus] = useState<{ [x: string]: any }>({});
  const router = useRouter();
  const ballotCount = (data as Election)?.ballotFiles ? Object.keys((data as Election).ballotFiles).length : 0

  const steps = [
    "Election Name",
    "Election Settings",
    "Ballot Data",
    "Production Voter Data",
    "Review",
  ];

  const handleConfigurationChange = (name: string, value: any) => {
    const newData = { ...(data || {}) } as { [x: string]: any };
    newData.configurations ||= {} as ElectionConfiguration;
    newData.configurations[name] = value;
    setData(newData as Election);
  };

  const handleDataChange = (name: string, value: any) => {
    const newData = { ...data } as { [x: string]: any };
    newData[name] = value;
    setData(newData as Election);
  };

  const save = async () => {
    let updatedElection:Election = null;

    if ((data as Election)?.electionId) {
      updatedElection = await setElectionAttributes(data as Election);
    } else {
      updatedElection = await createElection(data as ElectionCreate);
    }
    if ((data as Election)?.configurations) {
      updatedElection = await setElectionConfigurations(
        updatedElection.electionId,
        (data as Election).configurations
      );
    }
    setData(updatedElection);
    onUpdateElection(updatedElection);
  };

  const saveExit = async () => {
    await save();
    router.push("/dashboard");
  };

  const saveBack = async () => {
    await save();
    setStep(step - 1);
  };

  const saveNext = async () => {
    await save();
    setStep(step + 1);
  };

  const electionNameFields = (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Input
          required="You must specify the jurisdiction name."
          data={data}
          onChange={handleDataChange}
          name="electionJurisdictionName"
          label="Enter Jurisdiction Name."
          placeholder="Jurisdiction Name Here"
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          required="You must specify the election name."
          data={data}
          onChange={handleDataChange}
          name="electionName"
          label="Enter Election Name."
          placeholder="Election Name"
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          data={data?.configurations}
          onChange={handleConfigurationChange}
          name="stateName"
          label="Enter State Name."
          placeholder="State"
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          data={data?.configurations}
          onChange={handleConfigurationChange}
          name="stateCode"
          label="Enter State Abbreviation."
          placeholder="2-Letter State Abbreviation"
        />
      </Grid>
      <Grid item xs={12}>
        <DatePicker
          data={data}
          onChange={handleDataChange}
          name="electionDate"
          label="Enter Election Date"
          placeholder="E.g. 11/1/2022"
        />
      </Grid>
      <Grid item xs={12}>
        <DatePicker
          data={data}
          onChange={handleDataChange}
          name="electionVotingStartDate"
          label="Digital Absentee Voting Opening Date*"
          placeholder="E.g. 10/1/2022"
        />
      </Grid>
    </Grid>
  );

  const electionSettingsFields = (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3">Required Fields</Typography>
      </Grid>
      <Grid item sm={6}>
        <GC direction="column" spacing={1}>
          <GI>
            <InputSwitch
              value={data?.configurations?.absenteeStatusRequired}
              onChange={(value: boolean | null) => {
                handleConfigurationChange("absenteeStatusRequired", value);
              }}
            >
              Require Absentee Status
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.affidavitRequiresDLIDcardPhotos}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "affidavitRequiresDLIDcardPhotos",
                  value
                );
              }}
            >
              Affidavit requires ID Photo
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.affidavitOfferSignatureViaPhoto}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "affidavitOfferSignatureViaPhoto",
                  value
                );
              }}
            >
              Offer signature via photo
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.affidavitOfferSignatureViaName}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "affidavitOfferSignatureViaName",
                  value
                );
              }}
            >
              Offer signature via name
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.affidavitRequiresWitnessName}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "affidavitRequiresWitnessName",
                  value
                );
              }}
            >
              Affidavit requires witness name
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.affidavitRequiresWitnessSignature}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "affidavitRequiresWitnessSignature",
                  value
                );
              }}
            >
              Afidavit requires witness signature
            </InputSwitch>
          </GI>
          <Grid item>
            <InputSwitch
              value={data?.configurations?.multipleUsePermitted}
              onChange={(value: boolean | null) => {
                handleConfigurationChange(
                  "multipleUsePermitted",
                  value
                );
              }}
            >
              Multiple Use Permitted
            </InputSwitch>
            <Input
              multiline
              minRows={2}
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="multipleUseNotification"
              label="Multiple use notice text"
              placeholder="Enter notification text here"
            />
          </Grid>
          <GI>
            <InputSwitch
              value={data?.configurations?.DLNalpha}
              onChange={(value: boolean | null) => {
                handleConfigurationChange("DLNalpha", value);
              }}
            >
              DLN contains alpha characters
            </InputSwitch>
          </GI>
          <GI>
            <InputSwitch
              value={data?.configurations?.DLNnumeric}
              onChange={(value: boolean | null) => {
                handleConfigurationChange("DLNnumeric", value);
              }}
            >
              DLN contains numeral characters
            </InputSwitch>
          </GI>
          <GI>
            <InputLabel shrink>Drivers License Character Length</InputLabel>
            <Grid container spacing={2}>
              <Grid item xs>
                <Input
                  data={data?.configurations}
                  onChange={handleConfigurationChange}
                  name="DLNminLength"
                  placeholder="Min"
                />
              </Grid>
              <Grid item xs>
                <Input
                  data={data?.configurations}
                  onChange={handleConfigurationChange}
                  name="DLNmaxLength"
                  placeholder="Max"
                />
              </Grid>
            </Grid>
          </GI>
        </GC>
      </Grid>
      <Grid item sm={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Input
              data={data}
              onChange={handleDataChange}
              name="electionDefinitionURL"
              label="Election Definitions File Hostname"
            />
          </Grid>
          <Grid item>
            <Input
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="linkAbsenteeRequests"
              label="Absentee Requests URL"
            />
          </Grid>
          <Grid item>
            <Input
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="linkVoterReg"
              label="Voter Registration URL"
            />
          </Grid>
          <Grid item>
            <Input
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="linkBallotReturn"
              label="Ballot Return URL"
            />
          </Grid>
          <Grid item>
            <Input
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="linkMoreInfo1"
              label="More Info Link 1"
            />
          </Grid>
          <Grid item>
            <Input
              data={data?.configurations}
              onChange={handleConfigurationChange}
              name="linkMoreInfo2"
              label="More Info Link 2"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const onLoadBallot = useCallback(async (file: File) => {
    if ((data as Election)?.electionId) {
      const resp = await setBallotDefinitions(
        (data as Election).electionId,
        { file, ballotID: file.name }
      );
      setData(resp);
      return;
    }
  }, [data, setData])

  const onLoadVoterList = useCallback(async (file: File) => {
    if ((data as Election)?.electionId) {
      const resp = await setElectionVoters(
        (data as Election).electionId,
        file
      );
      setData({...(data as Election), voterCount: resp.voterCount})
      return;
    }
  }, [data, setData])

  const ballotDataFields = (
    <Grid container spacing={4}>
      <Grid item sm={6}>
        <Typography variant="h3">Upload Election Definition File</Typography>
        <FileUpload
          onLoadFile={async (file) => {
            if ((data as Election)?.electionId) {
              setEDFStatus({ status: "uploading" });
              const resp = await setElectionDefinition(
                (data as Election).electionId,
                file
              );
              if (resp) {
                setEDFStatus(resp);
                setEDFUid(resp.uuid);

                // TODO: Again weird that it returns an array... should probably be looked into
                // @ts-ignore
                const newElectionDataResp = await getElection((data as Election).electionId) as Election[]
                setData(newElectionDataResp)
              }
              return;
            }
          }}
        />
        <Box sx={{ backgroundColor: "background.paper", padding: 2 }}>
          {edfStatus.status === "error" && (
            <Box sx={{ color: "error.main" }}>
              Error Processing File: {edfStatus.message}
            </Box>
          )}
          {edfStatus.status === "uploading" && (
            <Box sx={{ textAlign: "center" }}>
              <Loading />
            </Box>
          )}
          {edfStatus.status === "complete" && (
            <Box>
              Uploaded on { Date() }
            </Box>
          )}
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="h3">Upload Ballot Files</Typography>
        <FileUpload
          multiple={true}
          onLoadFile={onLoadBallot}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3">Ballot checklist</Typography>
        <CompletedCheckbox
          isComplete={(data as Election)?.electionDefinitionCount > 0}
        >
          {(data as Election)?.electionDefinitionCount || 0} ballot definitions
          uploaded
        </CompletedCheckbox>
        <CompletedCheckbox isComplete={ballotCount > 0}>
          {ballotCount} ballot files uploaded
        </CompletedCheckbox>
      </Grid>
    </Grid>
  );

  const voterDataFields = (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h2">Production Voter Data</Typography>
      </Grid>

      <Grid item sm={6}>
        <Typography variant="h3">Production Voter List</Typography>
        <FileUpload
          onLoadFile={onLoadVoterList}
        />
      </Grid>
      <Grid item sm={6}>
        <Typography variant="h3">
          Production Voter List Upload History
        </Typography>
        <GC justifyContent="space-between">
          <GI>
            <Typography variant="subtitle2">Date</Typography>
          </GI>
          <GI>Action</GI>
        </GC>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="h3">
          Production Voter List Upload Checklist
        </Typography>
        <CompletedCheckbox isComplete={(data as Election)?.voterCount > 0}>
          {(data as Election)?.voterCount || 0} voters uploaded
        </CompletedCheckbox>
      </Grid>
    </Grid>
  );

  const reviewFields = (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3">Review Your Election.</Typography>
      </Grid>
      <Grid item xs={12}>
        <ElectionCard election={data as Election} />
      </Grid>
    </Grid>
  );

  let formContents: ReactNode = null;
  if (step === 0) {
    formContents = electionNameFields;
  } else if (step === 1) {
    formContents = electionSettingsFields;
  } else if (step === 2) {
    formContents = ballotDataFields;
  } else if (step === 3) {
    formContents = voterDataFields;
  } else if (step === 4) {
    formContents = reviewFields;
  }

  const actions = (
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid item xs={6} sm={4} md={3}>
        {step > 0 && (
          <Button startIcon={<NavigateBeforeIcon />} onClick={saveBack}>
            Prev
          </Button>
        )}
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        {step < steps.length - 1 && step !== 4 && (
          <Button endIcon={<NavigateNextIcon />} onClick={saveNext}>
            Next
          </Button>
        )}
        {step === steps.length - 1 && (
          <Button
            endIcon={<CheckIcon />}
            onClick={() => {
              router.push(
                `/elections/${(data as Election).electionId}/open-live`
              );
            }}
          >
            Open Election
          </Button>
        )}
      </Grid>
    </Grid>
  );

  const stepper = (
    <Stepper nonLinear activeStep={step}>
      {steps.map((label, index) => (
        <Step key={label} completed={step > index}>
          <StepButton color="inherit" onClick={() => setStep(index)}>
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );

  return (
    <Grid container direction="column" spacing={4} sx={{ minHeight: "100%" }}>
      <Grid item>
        <Typography variant="h1">{title}</Typography>
      </Grid>
      <Grid item flexGrow={1}>
        {formContents}
      </Grid>
      <Grid item>{actions}</Grid>
      <Grid item>{stepper}</Grid>
    </Grid>
  );
}
