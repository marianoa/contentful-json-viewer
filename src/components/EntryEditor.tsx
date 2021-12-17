import React, {useState, useEffect} from 'react';
import { EditorExtensionSDK } from '@contentful/app-sdk';
import { PlainClientAPI } from 'contentful-management';
// import the react-json-view component
import ReactJson from 'react-json-view';

interface EditorProps {
  sdk: EditorExtensionSDK;
  cma: PlainClientAPI;
}

const Entry = (props: EditorProps) => {
  const [json, setJson] = useState(JSON.stringify({}));
  const [sys, setSys] = useState({});

  const { sdk, cma } = props;

  //get the entryId
  const entryId = sdk.entry.getSys().id;

  //refresh the entry when there's a change, to get latest changes
  useEffect(() => {
    sdk.entry.onSysChanged((sys) => {
      setSys(sys);
    })
  })

  // @ts-ignore
  useEffect(async () => {
    // const data = await sdk.space.getEntry(entryId);
    const data = await cma.entry.references({entryId});
    setJson(JSON.stringify(data, null, 2))
  }, [sys]);

  return (
    <ReactJson src={JSON.parse(json)} displayDataTypes={false} />
  );
};

export default Entry;
