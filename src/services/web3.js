import Delinked from '../abis/Delinked.json'
import Web3 from 'web3';

class Web3Service {
    account = ''
    delinked = null
    networkData = null
    web3 = null
    constructor() {
        this.loadWeb3().then(() => {
            this.loadBlockchainData()
        })

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
        this.web3 = window.web3
    }
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        // this.setState({ account:  })
        this.account = accounts[0]
        //Network ID
        const networkId = await web3.eth.net.getId()
        this.networkData = Delinked.networks[networkId]
        if (this.networkData) {
            const delinked = new web3.eth.Contract(Delinked.abi, this.networkData.address)

            console.log(delinked);

            // this.setState({ delinked })
            this.delinked = delinked
            // const imagesCount = await delinked.methods.imageCount
            // this.setState({ imagesCount })
            // this.setState({ loading: false })
        } else {
            window.alert('Delinked contract not deployed to detected network. ')
        }
    }

    uploadImage(hash, desc) {
        return new Promise((resolve, reject) => {
            this.getContract().then(c => {
                console.log(c);
                c.methods.uploadImage(hash, desc)
                    .send({ from: this.account })
                    .on('confirmation', (r) => {
                        console.log(r);
                        resolve(r)
                    }).on('error', (err) => {
                        console.log(err);
                        reject(err)
                    })
            })
        })
    }

    getAllImages() {
        return new Promise((resolve, reject) => {
            this.getContract().then(c => {
                console.log(c);
                c.methods.getImages().call().then(r => {
                    console.log(r);
                    resolve(r)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }

    tipPost(post, amount) {
        return new Promise((resolve, reject) => {
            this.getContract().then(c => {
                c.methods.tipImageOwner(post.id)
                    .send({ from: this.account, value: this.web3.utils.toWei(amount.toString(), 'ether') })
                    .on('confirmation', (r) => {
                        resolve(true)
                    }).on('error', (err) => {
                        reject(err)
                    })
            })
        })
    }
    reTry = false;
    getContract() {
        return new Promise((resolve, reject) => {
            let check = setInterval(() => {
                if (this.delinked !== null) {
                    resolve(this.delinked);
                    clearInterval(check);
                } else {
                    if (!this.reTry) {
                        this.reTry = true;
                        this.getContract();
                    } else {
                        reject(null);
                    }
                }
            }, 1000);
        })

    }

    getCurrentAccount() {
        return new Promise((resolve, reject) => {
            if (this.web3) {
                this.web3.eth.getAccounts().then((acc) => {
                    // console.log(acc[0]);
                    resolve(acc[0]);
                });
            } else {
                reject(null);
            }
        });
    }
}

export default Web3Service