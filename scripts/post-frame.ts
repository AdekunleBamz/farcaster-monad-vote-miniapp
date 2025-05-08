import { Frame } from '@farcaster/frame-sdk'
import { frameMetadata } from '../app/frame-metadata'

async function postFrame() {
  try {
    const frame = new Frame()
    await frame.ready()
    
    // Post the frame
    const result = await frame.post(frameMetadata)
    console.log('Frame posted successfully:', result)
  } catch (error) {
    console.error('Error posting frame:', error)
  }
}

postFrame() 