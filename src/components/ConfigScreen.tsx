import React, { Component } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Heading, List, ListItem, Switch, Form, Workbench, Paragraph } from '@contentful/forma-36-react-components';
import { css } from 'emotion';

export interface AppInstallationParameters {}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  data: { active: boolean; contentType: any }[];
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);

    this.state = {
      data: [],
    };

    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" on the configuration screen.
    // For more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Generate a new target state with the App assigned to the selected
    // content types
    const targetState = await this.createTargetState();

    return {
      targetState,
    };
  };

  createTargetState = async () => {
    const appId = this.props.sdk.ids.app;

    const currentState = await this.props.sdk.app.getCurrentState();

    // return {
    //   // Transformation of an environment performed in the
    //   // installation process.
    //   targetState: {
    //     EditorInterface: {
    //       // Always pass in the `currentState` to avoid
    //       // removing any previous location configuration.
    //       ...currentState?.EditorInterface,
    //       'category': {
    //           editors: {
    //             // Places the entry at the second position
    //             // (position = 1) in the editors list for the
    //             // content type with ID `my-content-type-id`.
    //             widgetNamespace: "app",
    //             widgetId: appId,
    //             position: 4             
    //           }
    //       }
    //     }
    //   },
    // };
    
    const EditorInterface = this.state.data.reduce(
      (editorInterface: any, { active, contentType }) => {
        if (active) {
          console.log(contentType.sys.id)   
          editorInterface[contentType.sys.id] = {
            editors: [
              {
                widgetNamespace: "app",
                widgetId: appId,
                position: 4
              },
            ],
          };
        }
        console.log(editorInterface);
        return editorInterface;
      },
      currentState?.EditorInterface || {}
    );

    return { ...currentState, EditorInterface };
  };

  async componentDidMount() {
    const data = await this.getContentTypesUsingEditor();
    this.setState({ data }, () => {
      this.props.sdk.app.setReady();
    });
  }

  async getContentTypesUsingEditor() {
    const { space, ids } = this.props.sdk;

    const editorInterfaces = await space.getEditorInterfaces();
    const appId = ids.app;

    const appIncludedInEditors = (appId: any, editorInterface: any) => {
      if (editorInterface.editor) {
        return appId === editorInterface.editor.widgetId;
      } else if (editorInterface.editors) {
        return editorInterface.editors.some(({ widgetId }: any) => widgetId === appId);
      } else {
        return false;
      }
    };

    return Promise.all(
      editorInterfaces.items.map(async (ei: any) => {
        const contentTypeId = ei.sys?.contentType?.sys?.id;
        const contentType = await space.getContentType(contentTypeId);

        //return { contentType, active: appIncludedInEditors(appId, ei) };
        return { contentType, active: true };
      })
    );
  }

  toggleElement(index: number, current: boolean) {
    this.setState(state => {
      state.data[index].active = !current;
      return state;
    });
  }

  render() {
    return (
      <>
        <Heading>Select which Content Types will include the JSON Viewer</Heading>
        <List>
          {this.state.data.map(({ active, contentType }, index) => (
            <ListItem key={contentType.sys.id}>
              <Switch
                id={contentType.sys.id}
                labelText={contentType.name}
                isChecked={active}
                onToggle={() => this.toggleElement(index, active)}
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  }
}
