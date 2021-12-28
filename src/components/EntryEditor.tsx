import React, {useState, useEffect} from 'react';
import { EditorExtensionSDK } from '@contentful/app-sdk';
import { PlainClientAPI } from 'contentful-management';
// import the react-json-view component
import ReactJson from 'react-json-view';
import { Button, Dropdown, DropdownList, DropdownListItem, Flex  } from '@contentful/forma-36-react-components';

interface EditorProps {
  sdk: EditorExtensionSDK;
  cma: PlainClientAPI;
}

const Entry = (props: EditorProps) => {
  const [json, setJson] = useState(JSON.stringify({}));
  const [sys, setSys] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [depthState, SetDepthState] = useState(0);

  const { sdk, cma } = props;

  //get the entryId
  const entryId = sdk.entry.getSys().id;

  //refresh the entry when there's a change, to get latest changes
  useEffect(() => {
    sdk.entry.onSysChanged((sys) => {
      setSys(sys);
    })
  })

  // Handle Nested Include Depth
  const setDepthHandler = (event: React.MouseEvent<Element, MouseEvent>, depth: React.SetStateAction<number>) => {
    SetDepthState(depth);
    setOpen(!isOpen); // close the select list
  }

  // @ts-ignore
  useEffect(async () => {
    if (depthState >= 1) {
      const data = await cma.entry.references({
        entryId: entryId,
        include: depthState
      });
      setJson(JSON.stringify(data, null, 2))
    }
    else {
      const data = await sdk.space.getEntry(entryId);
      setJson(JSON.stringify(data, null, 2))
    }
  }, [sys, depthState]);


  return (<>
    <Flex margin="spacingS">
      <Flex marginRight="spacingM">
        <Dropdown
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          toggleElement={
            <Button size="small" buttonType="muted" indicateDropdown onClick={() => setOpen(!isOpen)}>
              Include Depth: {depthState}
            </Button>
          }
        >
          <DropdownList>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 0)}>No Nested Items</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 1)}>1</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 2)}>2</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 3)}>3</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 4)}>4</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 5)}>5</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 6)}>6</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 7)}>7</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 8)}>8</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 9)}>9</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 10)}>10</DropdownListItem>
          </DropdownList>
        </Dropdown>
      </Flex>
    </Flex>



    <Flex margin="spacingS">
      <ReactJson src={JSON.parse(json)} displayDataTypes={false} />
    </Flex>
  </>);
};

export default Entry;
