import { Frame } from '@farcaster/frame-sdk'
import { frameMetadata } from '../app/frame-metadata'

async function setupFarcasterMiniApp() {
  try {
    console.log('Setting up Farcaster mini app...')
    
    // Initialize Frame
    const frame = new Frame()
    await frame.ready()
    
    // Post the frame
    const result = await frame.post(frameMetadata)
    console.log('Frame posted successfully:', result)
    
    console.log('\nNext steps:')
    console.log('1. Go to https://warpcast.com/~/developers')
    console.log('2. Click "Create New Mini App"')
    console.log('3. Fill in the following details:')
    console.log('   - Name: Monad Vote')
    console.log('   - Description: Vote using MON tokens on Monad testnet')
    console.log('   - URL: Your Cloudflare Pages URL')
    console.log('   - Icon: Upload your app icon')
    console.log('\n4. After approval, your mini app will be available on Farcaster')
    
  } catch (error) {
    console.error('Error setting up Farcaster mini app:', error)
  }
}

setupFarcasterMiniApp() 