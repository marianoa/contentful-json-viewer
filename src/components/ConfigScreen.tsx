import React, { Component } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Typography, Heading, Paragraph, TextField} from '@contentful/forma-36-react-components';
import appScreenShot from '../assets/json-screenshot.png';
import styles from './styles';

export interface AppInstallationParameters {}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  previewApiToken: string;
  data: { active: boolean; contentType: any }[];
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);

    this.state = {
      previewApiToken: '',
      data: [],
    };

    this.updatePreviewApiToken = this.updatePreviewApiToken.bind(this)
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" on the configuration screen.
    // For more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Generate a new target state with the App assigned to the selected
    // content types
    const targetState = await this.createTargetState();
    const parameters = { previewApiToken: this.state.previewApiToken }

    return {
      parameters,
      targetState,
    };
  };

  createTargetState = async () => {

    const currentState = await this.props.sdk.app.getCurrentState();

    const EditorInterface = this.state.data.reduce(
      (editorInterface: any, { active, contentType }) => {
        if (active) {
          console.log(contentType.sys.id)   
          editorInterface[contentType.sys.id] = {
            //placing the JSON Viewer tab as the second tab
            //ideally we would place as the last tab (is it possible?)
            editors: { position : 1},           
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
    const parameters = await this.props.sdk.app.getParameters()
    const data = await this.getContentTypesUsingEditor();
    this.setState({
      previewApiToken: parameters?.previewApiToken,
      data,
    }, () => {
      this.props.sdk.app.setReady()
    })
  }

  async getContentTypesUsingEditor() {
    const { space, ids } = this.props.sdk;

    const editorInterfaces = await space.getEditorInterfaces();

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

        return { contentType, active: true };
      })
    );
  }

  updatePreviewApiToken(event: any) {
    this.setState({
        previewApiToken: event.target.value,
    })
  }

  render() {
    return (
      <>
      <div className={styles.background} />
      <div className={styles.body}>
        <div>
          <Typography>
            <Heading className={styles.spaced}>About the JSON Viewer app</Heading>

            <Paragraph>
                This app adds a new tab on the entry aditor allowing you to visualize the JSON payload for the current entry. This object is the result of calling the Preview API on the entry.
            </Paragraph>
           
            <Paragraph>
              Installing this app will add the entry editor tab to all Content Types in your space.  
            </Paragraph>
            <div className={styles.logo}>
              <img src={appScreenShot} alt="JSON Viewer" width="400"/>
            </div>
            <Heading className={styles.spaced}>Configuration</Heading>
            <Paragraph>
              Please supply the Preview API token for this space:
            </Paragraph>
            <TextField
              required
              name="previewApiToken"
              id="previewApiToken"
              labelText="previewApiToken"
              value={this.state.previewApiToken}
              onChange={this.updatePreviewApiToken}
            />
          </Typography>
        </div>
      </div>
      </>
    );
  }
}
