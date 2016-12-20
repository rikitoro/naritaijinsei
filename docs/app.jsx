const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const AWS = require('aws-sdk');
const UUID = require('uuid');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:06a88243-bfb8-4122-8fc8-879c85b4be72'
});

const ImageViewer = (props) => {
  if (props.imageUrl) {
    return <div><img src={props.imageUrl} /></div>;
  } else {
    return <div><p> IF I WERE A PRETTY CAT...</p></div>;
  }
};

const KumaImage = React.createClass({
  render: function () {
    let image = '';
    if (this.props.imageUrl) {
        image = <img src={this.props.imageUrl}/>
    }
    return (
      <div>{image}</div>
    );
  }
});

const App = React.createClass({
  getInitialState: function() {
    return {
      file: null,
      filename: '',
      imageUrl: null,
      progress_state: 'initial'
    };
  },

  handleSelectFile: function(event) {
    const file = event.target.files[0];
    if (file) {
      this.setState({
        file: file,
        filename: UUID.v4() + '-' + file.name,
        progress_state: 'fileselected'
      });
    } else {
      this.setState({
        file: null,
        filename: null,
        progress_state: 'initial'
      });
    }
  },

  uploadClick: function (event) {
    this.uploadFile();
  },

  uploadFile: function () {
    this.setState({progress_state: 'file_uploading'})
    const s3 = new AWS.S3();
    const object = {
      Bucket: 'naritaijinsei',
      Key: 'input/' + this.state.filename,
      ContentType: this.state.file.type,
      Body: this.state.file
    };
    const self = this;
    s3.putObject(object, function(err, data) {
      if (err) {
        console.log("Error :" + err);
      } else {
        console.log("Successfully uploaded");
      }
      self.setState({progress_state: 'file_uploaded'});
    });
  },

  narimasuClick: function (event) {
    this.setState({progress_state: 'api_requesting'});
    const config = "neko_config.json";
    const source_image = this.state.filename;
    const api_endpoint = "https://2vddqdwgcl.execute-api.ap-northeast-1.amazonaws.com/beta"
    const param = {
      config: config,
      source_image: source_image
    };
    //const url = api_endpoint + '?' + 'config=' + config + '&source_image=' + source_image;
    //console.log(url);
    const self = this;
    $.getJSON(api_endpoint, param).then(
      function (data) {
        console.log("image_url:" + data["image_url"]);
        self.setState({imageUrl: data["image_url"]});
      },
      function (data) {
        console.log('Error: ' + data);
      }
    ).done(
      function() {
        self.setState({progress_state: 'api_requested'})
      }
    );

  },

  canUpload: function () {
    if (this.state.progress_state == 'file_selected') {
      return true;
    }
    return false;
  },

  canBeKuma: function () {
    if (this.state.progress_state == 'file_uploaded') {
      return true;
    }
    return false;
  },

  render: function() {
    return (
      <MuiThemeProvider>
      <Card>
        <CardHeader title="If I were a pretty cat"/>
        <CardActions>
        <input type="file" ref="file" accept="image/*"
          onChange={this.handleSelectFile} />
        <button onClick={this.uploadClick}>
          ファイルをアップロード
        </button>
        <button onClick={this.narimasuClick}>
          猫になる！
        </button>
        <ImageViewer imageUrl = {this.state.imageUrl}/>
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