import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';

const partclesOptions = {
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  user: {
    id: '',
    name: '',
    email: '',
    entries: '0',
    joined: ''
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }


  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(err => console.log(err))
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box});
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value});
  }

  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState(initialState)
    }
    this.setState({route: route});
  }

  onButtonSubmit= () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://dry-atoll-95702.herokuapp.com/imageurl', {
          method: 'post',
          headers: { 'Content-type': 'application/json'},
          body: JSON.stringify({
              input: this.state.input
          })
        })
        .then(response => response.json())
        .then(data => {
          if(data){
            this.displayFaceBox(this.calculateFaceLocation(data));
            fetch('https://dry-atoll-95702.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id
            })
        })
        .then(res => res.json())
        .then(data => this.setState( Object.assign(this.state.user, { entries: data})))
      }
    }
  )
  .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={partclesOptions}
        />
        { this.state.route === 'home'
        ? <div>
            <Navigation  onRouteChange={this.onRouteChange}/>
            <Logo />
            <Rank userName={ this.state.user.name.toUpperCase() } entries={ this.state.user.entries }/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
        : (
          this.state.route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} loadUser={ this.loadUser }/>
          : <Register onRouteChange={this.onRouteChange} loadUser={ this.loadUser }/>
        )
          }
      </div>
    );
  }
}

export default App;
