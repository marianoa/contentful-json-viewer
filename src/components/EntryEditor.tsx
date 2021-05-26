import React, {useState, useEffect} from 'react';
import { Paragraph, SkeletonDisplayText } from '@contentful/forma-36-react-components';
import { EditorExtensionSDK } from '@contentful/app-sdk';
import { setSyntheticLeadingComments } from 'typescript';
// import the react-json-view component
import ReactJson from 'react-json-view';

interface EditorProps {
  sdk: EditorExtensionSDK;
}

const Entry = (props: EditorProps) => {
  const [json, setJson] = useState(JSON.stringify({}));
  const [sys, setSys] = useState({});
  
  const { sdk } = props;
  
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
    const data = await sdk.space.getEntry(entryId);
    setJson(JSON.stringify(data, null, 2))
  }, [sys]);

  return (<ReactJson src={JSON.parse(json)} displayDataTypes={false} /> 
  );
};

export default Entry;
