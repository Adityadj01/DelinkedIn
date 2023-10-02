import './App.css';
import Web3 from 'web3';
import Login from "./components/Login";
import Home from "./components/Home";
import HomeSearch from "./components/HomeSearch";
import HomeDisplay from "./components/HomeDisplay";
import HomePageThree from "./components/HomePageThree";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Main from './components/Main';
import { Component } from 'react';
import Delinked from './abis/Delinked.json'
import samp from './components/samp'
import Samp from './components/samp';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Delinked.networks[networkId]
    if (networkData) {
      const delinked = new web3.eth.Contract(Delinked.abi, networkData.address)
      this.setState({ delinked })
      const imagesCount = await delinked.methods.imageCount
      this.setState({ imagesCount })
      this.setState({ loading: false })
    } else {
      window.alert('Delinked contract not deployed to detected network. ')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      Delinked: null,
      images: [],
      loading: true
    }
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" Component={Login} />
            <Route exact path="/" component={HomeSearch} />
            <Route exact path="/" component={HomeDisplay} />
            <Route exact path="/" component={HomePageThree} />

            <Route exact path="/home" Component={Samp} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
