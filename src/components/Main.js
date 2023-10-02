import styled from "styled-components";
import React, { Component } from "react";
import IPFSService from "../services/ipfs";
import Web3Service from "../services/web3";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IPFS: "",
      desc: "",
      web3: null,
      posts: [],
      tip: 0,
      errMsg: "",
      acount: "",
    };
  }
  componentDidMount() {
    const web3 = new Web3Service();
    this.setState({ web3: web3 });

    setTimeout(() => {
      this.getAllImages();
    }, 1500);

    setTimeout(() => {
      this.state.web3.getCurrentAccount().then((a) => {
        this.setState({ account: a });
      });
    }, 2000);
  }

  getAllImages() {
    this.state.web3.getAllImages().then((r) => {
      console.log(r);
      this.setState({ posts: r });
    });
  }

  uploadImage = () => {
    console.log(this.state.desc, this.state.IPFS);
    this.state.web3
      .uploadImage(this.state.IPFS, this.state.desc)
      .then((r) => {
        this.getAllImages();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  captureFile(event) {
    new IPFSService()
      .getIPFS()
      .add(event.target.files[0])
      .then((r) => {
        this.setState({ IPFS: r.path });
      });
  }

  handleTipPost(post) {
    if (this.state.tip <= 0) {
      this.setState({ errMsg: "Tip should be greater than zero 🙂" });
      return;
    }
    this.state.web3.tipPost(post, this.state.tip).then((r) => {
      console.log(r);
      this.getAllImages();
    });
  }

  render() {
    return (
      <Container>
        <Post>
          <main role="main" style={{ maxWidth: "500px" }}>
            <div>
              <p>&nbsp;</p>

              <h2>Upload Post</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  this.uploadImage();
                }}
              >
                <br />
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".jpg, .jpeg, .png, .bmp, .gif"
                  encoding="base64"
                  onChange={(event) => this.captureFile(event)}
                />
                <br />
                <br />
                <Imgdes>
                  <input
                    id="imageDescription"
                    type="text"
                    onChange={(input) =>
                      this.setState({ desc: input.target.value })
                    }
                    className="form-control"
                    placeholder="Description..."
                    required
                  />
                </Imgdes>
                <br></br>
                <br />
                <Hdfc>
                  <button type="submit">Upload!</button>
                </Hdfc>
              </form>

              <p>&nbsp;</p>
            </div>
          </main>
        </Post>
        {/* list of posts */}
        {/* Posts */}
        <>
          {this.state.posts.map((p, i) => (
            <div className="post" key={i}>
              <div className="user">
                <img className="user-img" src="/images/user.svg" alt="" />
                <div className="user-id">
                  <pre>{p.author}</pre>
                </div>
              </div>
              <div className="desc">{p.description}</div>
              <img src={"http://localhost:8080/ipfs/" + p.hash} alt="post" />
              <div className="tips">
                <span>
                  &nbsp;&nbsp; <b>Tips:</b>{" "}
                </span>{" "}
                &nbsp;&nbsp;
                <span className="tip-amount">
                  {p.tipAmount / 1000000000000000000} ETH
                </span>
              </div>
              {this.state.account !== p.author ? (
                <>
                  <div className="tip-post">
                    <input
                      className="tip-input"
                      type="number"
                      value={this.state.tip}
                      onChange={(ev) => {
                        this.setState({ tip: ev.target.value });
                        this.setState({ errMsg: "" });
                      }}
                    />{" "}
                    <button
                      className="tip-btn"
                      onClick={() => this.handleTipPost(p)}
                    >
                      Tip
                    </button>
                    <span className="error">{this.state.errMsg}</span>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </>
      </Container>
    );
  }
}

const Container = styled.div`
  grid-area: ;
`;
const Hdfc = styled.div`
  display: inline-flex;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
  background-color: #b5cbf4;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 12px;
`;

const Imgdes = styled.div`
  display: inline-flex;
  align-items: center;
  text-align: center;
  margin-bottom: 4px;
  background-color: #c0c0c0;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 5px;
`;
const Post = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 12px;
`;

export default Main;
