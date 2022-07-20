import React, {useState, useEffect} from 'react';
import { EditorExtensionSDK } from '@contentful/app-sdk';
import { PlainClientAPI, LocaleProps } from 'contentful-management';
// import the react-json-view component
import ReactJson, { CollapsedFieldProps } from 'react-json-view'
import { createClient } from 'contentful'
import { Button, Dropdown, DropdownList, DropdownListItem, Flex  } from '@contentful/forma-36-react-components';

interface EditorProps {
  sdk: EditorExtensionSDK;
  cma: PlainClientAPI;
}

const Entry = (props: EditorProps) => {
  const [json, setJson] = useState(JSON.stringify({}));
  const [sys, setSys] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [depthState, SetDepthState] = useState(10);
  const [isLocaleOpen, setIsLocaleOpen] = useState(false)
  const [locales, setLocales] = useState<LocaleProps[]>()
  const [selectedLocale, setSelectedLocale] = useState<LocaleProps>()

  const { sdk, cma } = props;

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

  const setLocaleHandler = (event: any, locale: any) => {
    setSelectedLocale(locale)
    setIsLocaleOpen(!isLocaleOpen)
  }

  const stringify_json = (item: any) => {
    var cache: object[] | null = []
    const item_str = JSON.stringify(item, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache?.includes(value)) return "---CIRCULAR REFERENCE REMOVED---"

        // Store value in our collection
        cache?.push(value)
      }
      return value
    },2)
    cache = null // Enable garbage collection
    return item_str
  }

  useEffect(() => {
    ;(async ()=> {
      const _locales = await cma.locale.getMany({})
      setLocales(_locales.items)
      const default_locale = _locales.items.find((l) => l.default)
      setSelectedLocale(default_locale)
    })()
  },[cma.locale])

  // @ts-ignore
  useEffect(() => {
    ;(async () => {
      const installation_params: {[index: string]:any} = sdk.parameters.installation
      const token: string = installation_params['previewApiToken']
      const cpa = createClient({
        space: sdk.ids.space,
        environment: sdk.ids.environment,
        accessToken: token,
        host: 'preview.contentful.com'
      })
      const data = await cpa.getEntries({
        'sys.id': sdk.ids.entry,
        include: depthState,
        locale: selectedLocale?.code || sdk.locales.default,
      })
      setJson(stringify_json(data.items[0]))
    })()
  }, [depthState, sdk, selectedLocale]);

  const collapser = (field:CollapsedFieldProps) => {
    // const { name, src, type, namespace } = field
    const { name } = field
    if (name === 'sys') return true
    if (name === 'metadata') return true
    return false
  }

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
      <Flex marginRight="spacingM">
        <Dropdown
          isOpen={isLocaleOpen}
          onClose={() => setIsLocaleOpen(false)}
          toggleElement={
            <Button size="small" buttonType="muted" indicateDropdown onClick={() => setIsLocaleOpen(!isLocaleOpen)}>
              Locale: {selectedLocale?.name}
            </Button>
          }
        >
          <DropdownList>
            {locales && locales.map((locale, i) => 
              <DropdownListItem key={i} onClick={(event) => setLocaleHandler(event, locale)}>{locale.name}</DropdownListItem>  
            )}
          </DropdownList>
        </Dropdown>
      </Flex>
    </Flex>

    <Flex margin="spacingS">
      <ReactJson
        src={JSON.parse(json)}
        name={false}
        displayDataTypes={false}
        shouldCollapse={collapser}
        collapseStringsAfterLength={80}
        enableClipboard={false}
        displayObjectSize={false}
      />
    </Flex>
  </>);
};

export default Entry;
