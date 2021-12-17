import React, {useState, useEffect} from 'react';
import { EditorExtensionSDK } from '@contentful/app-sdk';
// import the react-json-view component
import ReactJson from 'react-json-view';
import { Accordion, AccordionItem, Dropdown, DropdownList, DropdownListItem,
  SectionHeading, Note, Paragraph, Button } from '@contentful/forma-36-react-components';

interface EditorProps {
  sdk: EditorExtensionSDK;
}

const Entry = (props: EditorProps) => {
  const [json, setJson] = useState(JSON.stringify({}));
  const [sys, setSys] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [depthState, SetDepthState] = useState(1);

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
    const data = await cma.entry.references({
      entryId: entryId,
      include: depthState
    });
    setJson(JSON.stringify(data, null, 2))
  }, [sys, depthState]);


  return (<>
    <Accordion>
      <AccordionItem title={<SectionHeading>JSON Viewer Options</SectionHeading>}>

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
            <DropdownListItem onClick={(event) => setDepthHandler(event, 1)}>1 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 2)}>2 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 3)}>3 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 4)}>4 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 5)}>5 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 6)}>6 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 7)}>7 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 8)}>8 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 9)}>9 Nested Levels</DropdownListItem>
            <DropdownListItem onClick={(event) => setDepthHandler(event, 10)}>10 Nested Levels</DropdownListItem>
          </DropdownList>
        </Dropdown>

      </AccordionItem>
    </Accordion>
    <ReactJson src={JSON.parse(json)} displayDataTypes={false} />
  </>);
};

export default Entry;
