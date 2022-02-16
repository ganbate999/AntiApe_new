import React, { useState } from "react";
import { parseEther } from "@ethersproject/units";
import { ETH_VAL } from "../../constants";
import { Account } from "../../components";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";


import {
  Container,
  InnerContainer,
  TextWrapper,
  NFTContainer,
  ProgressBarContainer,
  ButtonWrapper,
  ImgWrapper,
  PointWrapper,
} from "./styles"; //k-k
const Model = () => {
  const gltf = useLoader(GLTFLoader, "./adamHead/adamHead.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={1.2} />
    </>
  );
};
export const Home = ({ address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  contract, signer, remainTokenCount }) => {
  const [amount, setAmount] = useState(ETH_VAL);
  const [minting, setMinting] = useState(false);
  const [cnt, setCnt] = useState(1);
  const [currentAccount, setCurrentAccount] = useState(null);

  const mintNftHandler = async () => {
    setMinting(true);
    try {
      const mintFunction = contract.connect(signer)["mint"];
      console.log(mintFunction)
      const hash = await mintFunction(cnt, {
        value: parseEther((amount * cnt).toString()),
      });
      await hash.wait();
      setMinting(false);
    } catch (e) {
      setMinting(false);
      console.log(e);
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };
  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  return (
    <Container>
      <InnerContainer>
        <TextWrapper>
          <h1>MINT AN ANTI APE NOW</h1>
          <h2>{remainTokenCount}/11111</h2>
          <NFTContainer>
            <p>NFT Count {cnt > 0 && <span>{cnt}</span>}</p>
            <ProgressBarContainer>
              <PointWrapper active={true} onClick={() => setCnt(1)} />
              <PointWrapper active={true} onClick={() => setCnt(1)} />
              <PointWrapper active={cnt > 1} onClick={() => setCnt(2)} />
            </ProgressBarContainer>
          </NFTContainer>
          <ButtonWrapper>
            <Account
                address={address}
                localProvider={localProvider}
                userSigner={userSigner}
                mainnetProvider={mainnetProvider}
                price={price}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
                blockExplorer={blockExplorer}
                contract={contract}
                signer={userSigner}
                remainTokenCount={remainTokenCount}
              />
          </ButtonWrapper>
        </TextWrapper>
        <ImgWrapper>
        <Canvas>
        <Suspense fallback={null}>
          <Model />
          
        </Suspense>
      </Canvas>
        </ImgWrapper>
      </InnerContainer>
    </Container>
  );
};
