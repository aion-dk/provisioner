import type { NextPage } from 'next'
import LoggedInLayout from 'layout/LoggedInLayout'
import { Button, Card, Grid, Paper, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'


import Input from 'component/Input';

import theme from 'theme'
import UserContext from 'context/UserContext'
import { requestLoginCode } from 'requests/auth'
import { useRouter } from 'next/router'
import { Election, Maybe } from 'types'
import { getAll as getAllElections, getElection } from 'requests/election'
import Section from 'component/Section'
import ElectionCard from 'component/ElectionCard'
import { Box } from '@mui/system'
import ElectionForm from 'component/ElectionForm';

const NewElection: NextPage = () => {
  const [election, setElection] = useState<Maybe<Election>>(null)
  
  const router = useRouter();
  const { query } = router;
  const { id } = query;

  const electionId = Array.isArray(id) ? id[0] : id;
  

  useEffect(()=> {
    const loadElection = async () => {
      if (electionId) {
        // const configuration = await getConfigurations(electionId);
        // resp.configuration = configuration;

        // TODO: Temp remove this call
        // const resp = await getElection(electionId) as Election[];
        // setElection(resp);

        // TODO: This is probably some consequence of another issue
        // @ts-ignore
        const resp = await getElection(electionId) as Election[];
        console.log('Got this list:')
        console.log(resp)
        const foundElection = resp?.find(x => x.electionId === electionId)
        console.log('Found this election:')
        console.log(foundElection)
        setElection(foundElection);
      }
    }
    if (electionId) {
      loadElection();
    }
  }, [electionId])
  

  console.log(election)

  return <LoggedInLayout title="Create Election">
    {election && <ElectionForm election={election}  title="Update Election" onUpdateElection={(e)=>setElection(e)}/>}
  </LoggedInLayout>
}

export default NewElection;