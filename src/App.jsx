import React, { useEffect, useState } from "react";

import { ethers } from "ethers";

import Cards from "./components/Cards/Cards"
import abi from "./utils/WavePortal.json"
import './App.css';

const App = () => {


  /*
   * All state property to store all waves
   */
	const [currentAccount, setCurrentAccount] = useState("");
	const [allWaves, setAllWaves] = useState([]);
	const [loading, updateLoading] = useState(true);
	const [inputValue, setInputValue] = useState("");
	const [disable, toggleDisable] = useState(true);

	const contractAddress = "0xAa4563378B35A40b3Ba0b44b1AF2Fe7abA1E6AAB";
	const contractABI = abi.abi;

	const clearInput = () => {
		setInputValue("");
	}

	function isValidHttpUrl(string) {
		let url;

		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}

		return url.protocol === "http:" || url.protocol === "https:";
	}

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
		console.log(inputValue, isValidHttpUrl(inputValue))

		isValidHttpUrl(inputValue) ? toggleDisable(false) : null;
		console.log('disable', disable)
	}

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object", ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				setCurrentAccount(account);
				getAllWaves();
			} else {
				console.log("No authorized account found")
			}
		} catch (error) {
			console.log(error);
		}
	}

  /**
  * Implement your connectWallet method here
  */
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_requestAccounts" });

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

	/*
		 * Create a method that gets all waves from your contract
		 */
	const getAllWaves = async () => {
		const { ethereum } = window;

		try {
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
				const waves = await wavePortalContract.getAllWaves();

				updateLoading(false);

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
				let wavesCleaned = waves.map(wave => {
					return {
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message
					};
				});

        /*
         * Store our data in React State
         */
				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error);
		}
	}

	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());

				/*
				* Execute the actual wave from your smart contract
				*/
				const waveTxn = await wavePortalContract.wave(inputValue, { gasLimit: 300000 })
				updateLoading(true)
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);

				setInputValue('')
				console.log('inputValue after mined', inputValue)

				count = await wavePortalContract.getTotalWaves();
				// updateFans(fans => [...fans, currentAccount]);
				console.log("currentAccount", currentAccount)
				// updateAdresses([...adresses, currentAccount]
				console.log("Retrieved total wave count...", count.toNumber());
				getAllWaves();
				updateLoading(false)

			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected();
		
		let wavePortalContract;

		const onNewWave = (from, timestamp, message) => {
			console.log('NewWave', from, timestamp, message);
			setAllWaves(prevState => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message,
				},
			]);
		};

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
			wavePortalContract.on('NewWave', onNewWave);
		}

		return () => {
			if (wavePortalContract) {
				wavePortalContract.off('NewWave', onNewWave);
			}
		};
	}, []);


	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">
					👋 Hey there!
        </div>

				<div className="bio">
					I am wolfbit and I really like dark mode! Connect your Ethereum wallet and wave at me! I like discover new things share with me us an interesting documentary
					<div className='links' >
						<a className='bio_links twitter' href='https://twitter.com/YBoudoul'>Twitter</a>
						<a className='bio_links github' href='https://github.com/unes07'>Github</a>
					</div>
				</div>

				<input className="inp" type="url" placeholder="Documentary Link" value={inputValue} onChange={handleInputChange} />

				<button disabled={!isValidHttpUrl(inputValue) || loading} className="waveButton tooltip" onClick={wave}>
					Wave at Me
						{!isValidHttpUrl(inputValue) ? <span className="tooltiptext">Enter a valid URL</span> : null}

				</button>

				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						Connect Wallet
          </button>
				)}

				<Cards allWaves={allWaves} loading={loading} />

				{}

				{allWaves.map((wave, index) => {
					return (
						<div key={index} className='shares'>
							<div>Thanks to: {wave.address}</div>
							<div>Documentary Link: <a href={wave.message}>{wave.message}</a></div>
							<div>{wave.timestamp.toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
						</div>)
				})}
			</div>
		</div>
	);
}

export default App