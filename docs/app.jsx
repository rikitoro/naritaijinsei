const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const AWS = require('aws-sdk');
const UUID = require('uuid');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin()

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:06a88243-bfb8-4122-8fc8-879c85b4be72'
});

const ImageViewer = (props) => {
  switch(props.imageViewerState) {
    case 'uploading':
      return (
        <div>
          <p>Now, uploading your image...</p>
          <CircularProgress size={80} thickness={5} />
        </div>);
      break;
    case 'uploadErr':
      return (
        <div>
          <p>Sorry, cannot upload your image.</p>
        </div>
      );
      break;
    case 'synthesizing':
      return (
        <div>
          <p>Now, Nekonizing you...</p>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
      break;
    case 'synthesizeErr':
      return (
        <div>
          <p>Sorry, you cannot be a cat.</p>
        </div>
      );
      break;
    case 'completed':
      return (
        <div>
          <img src={props.imageUrl} />
        </div>
      );
      break;
    default:
      return (
        <div>
          <p>If I were a cat...</p>
        </div>
      );
      break;
    }
}

const App = React.createClass({
  getInitialState: function() {
    return {
      imageUrl: '',
      imageViewerState: 'initial',
      uploadEnable: true
    };
  },

  handleSelectFile: function(event) {
    const self = this;
    const uploadfile = event.target.files[0];
    const uploadfileName = UUID.v4() + '-' + uploadfile.name;

    // select image file with faces
    const selectImageTask = function () {
      self.setState({
        imageUrl: '',
        imageViewerState: 'initial',
        uploadEnable: true
      });
    };

    // upload file to S3
    const uploadFileTask = function () {
      self.setState({
        imageViewerState: 'uploading',
        uploadEnable: false
      });
      self.uploadFile(uploadfile, uploadfileName)
      /* Error Handling Here
      if (!this.uploadFile(uploadfile, uploadfileName)) {
        this.setState({
          imageUrl: '',
          imageViewerState: 'uploadErr',
          uploadEnable: true
        });
        return;
      }
      */
    };

    const synthesizeTask = function () {
      /*
      this.setState({
        imageViewerState: 'synthesizing'
      });
      const imageUrl = this.synthesize(uploadfileName);
      if (imageUrl == '') {
        this.setState({
          imageUrl: '',
          imageViewerState: 'synthesizeErr',
          uploadEnable: true
        });
      }
      */
    };

    // display image
    const displayTask = function () {
      /*
      this.setState({
        imageUrl: imageUrl,
        imageViewerState: 'completed',
        uploadEnable: true
      });
      */
    }

    // Deffer planning

  },

  uploadFile: function (file, filename) {
    const s3 = new AWS.S3();
    const object = {
      Bucket: 'naritaijinsei',
      Key: 'input/' + filename,
      ContentType: file.type,
      Body: file
    };
    let flag = false;
    const self = this;
    s3.putObject(object, function(err, data) {
      if (err) {
        console.log("Upload Error :" + err);
      } else {
        console.log("Successfully uploaded");
        flag = true;
      }
    });
    return flag;
  },

  synthesize: function(filename) {
    const config = "neko_config.json";
    const source_image = filename;
    const api_endpoint = "https://2vddqdwgcl.execute-api.ap-northeast-1.amazonaws.com/beta";
    const param = {
      config: config,
      source_image: source_image
    };
    const self = this;
    $.getJSON(api_endpoint, param).then(
      function (data) {
        console.log("image_url:" + data["image_url"]);
        self.setState({imageUrl: data["image_url"]});
        return data["image_url"];
      },
      function (data) {
        console.log('Error: ' + data);
        return ''
      }
    );
  },

  render: function() {
    return (
      <MuiThemeProvider>
      <Card>
        <CardTitle
          title="What's it like being a cat?"
        />
        <CardText>
          Take a picture with your face.
        </CardText>
        <CardActions>
\       <input type="file" ref="files" accept="image/*"
          onChange={this.handleSelectFile}
          disabled={!this.state.uploadEnable} />
        <ImageViewer
          imageViewerState = {this.state.imageViewerState} />
          imageUrl = {this.state.imageUrl}
        </CardActions>
      </Card>
      </MuiThemeProvider>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);