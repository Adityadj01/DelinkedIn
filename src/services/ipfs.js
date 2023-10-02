import { create } from 'ipfs-http-client'

// connect to the default API address http://localhost:5001


class IPFSService {

    IPFS = create({ url: "http://127.0.0.1:5001/api/v0" });
    // const auth =
    //     'Basic ' + Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');
    // const IPFS = create({
    //     host: 'ipfs.infura.io',
    //     port: 5001,
    //     protocol: 'https',
    //     headers: {
    //         authorization: auth,
    //     },
    // });
    getIPFS() {
        return this.IPFS;
    }
}

export default IPFSService