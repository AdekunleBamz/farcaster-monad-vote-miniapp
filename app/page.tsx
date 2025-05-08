'use client'

import { useEffect, useState } from 'react'
import Frame from '@farcaster/frame-sdk'
import { frameMetadata } from './frame-metadata'
import { ethers } from 'ethers'

// Monad testnet contract addresses
const MONAD_TESTNET_RPC = 'https://rpc.testnet.monad.xyz'
const MON_TOKEN_ADDRESS = '0x...' // Replace with actual MON token address
const VOTING_CONTRACT_ADDRESS = '0x...' // Replace with actual voting contract address

// ABI for MON token (ERC20)
const MON_TOKEN_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)'
]

// ABI for voting contract
const VOTING_CONTRACT_ABI = [
  'function castVote(uint256 optionId) public',
  'function getVotes(uint256 optionId) public view returns (uint256)'
]

const VOTING_OPTIONS = [
  {
    id: 1,
    title: 'Build More Mini Apps',
    description: 'Create more interactive experiences on Farcaster'
  },
  {
    id: 2,
    title: 'Enhance Frame Features',
    description: 'Add more capabilities to Farcaster Frames'
  },
  {
    id: 3,
    title: 'Improve User Experience',
    description: 'Focus on making apps more user-friendly'
  },
  {
    id: 4,
    title: 'Expand Developer Tools',
    description: 'Provide better tools for Farcaster developers'
  }
]

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<number, number>>({})
  const [isVoting, setIsVoting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [monBalance, setMonBalance] = useState<string>('0')
  const [frame, setFrame] = useState<Frame | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...')
        
        // Initialize Frame SDK
        const frameInstance = new Frame()
        await frameInstance.ready()
        setFrame(frameInstance)

        // Initialize provider
        const provider = new ethers.JsonRpcProvider(MONAD_TESTNET_RPC)
        
        // Load current votes
        const votingContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider)
        const voteCounts = await Promise.all(
          VOTING_OPTIONS.map(option => votingContract.getVotes(option.id))
        )
        
        const initialVotes = VOTING_OPTIONS.reduce((acc, option, index) => ({
          ...acc,
          [option.id]: Number(voteCounts[index])
        }), {})

        if (mounted) {
          setVotes(initialVotes)
          setIsReady(true)
        }
      } catch (err) {
        console.error('App initialization error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize app. Please try again.')
        }
      }
    }

    initializeApp()

    return () => {
      mounted = false
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install Monad wallet')
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        
        // Get MON balance
        const provider = new ethers.JsonRpcProvider(MONAD_TESTNET_RPC)
        const monContract = new ethers.Contract(MON_TOKEN_ADDRESS, MON_TOKEN_ABI, provider)
        const balance = await monContract.balanceOf(accounts[0])
        setMonBalance(ethers.formatEther(balance))
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError('Failed to connect wallet. Please try again.')
    }
  }

  const handleVote = async (option: string) => {
    if (!frame) return

    try {
      const result = await frame.post({
        ...frameMetadata,
        buttons: [
          {
            label: `Voted for ${option}`,
            action: 'post',
          },
        ],
      })
      console.log('Vote result:', result)
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            {!walletAddress ? 'Please connect your wallet to vote.' : 'Make sure you have enough MON tokens to vote.'}
          </p>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing app...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">Monad Vote</h1>
        <p className="text-center text-gray-600 mb-8">Vote using MON tokens on Monad testnet</p>
        
        {!walletAddress ? (
          <div className="text-center mb-8">
            <button
              onClick={connectWallet}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Connect Monad Wallet
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
            <p className="text-sm text-gray-600">Connected Wallet: {walletAddress}</p>
            <p className="text-sm text-gray-600">MON Balance: {monBalance} MON</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">What should we focus on next?</h2>
            
            <div className="space-y-4">
              {VOTING_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.title)}
                  disabled={isVoting || !walletAddress}
                  className="w-full bg-white hover:bg-gray-50 text-left border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary">{votes[option.id] || 0} votes</span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 