export interface ARMarker {
  id: string
  type: 'image' | 'qr' | 'object' | 'text'
  pattern?: string // For image/QR code markers
  keywords?: string[] // For text recognition
  boundingBox?: DOMRect
  confidence: number
  arContent: ARContent
}

export interface ARContent {
  id: string
  title: string
  description: string
  type: '3d_model' | 'animation' | 'info_panel' | 'interactive_quiz' | 'video' | 'audio'
  mediaUrl?: string
  modelUrl?: string // For 3D models
  animationData?: any // For animations
  quizData?: {
    questions: Array<{
      question: string
      options: string[]
      correct: number
      explanation: string
    }>
  }
  interactionData?: {
    hotspots: Array<{
      position: { x: number; y: number; z: number }
      label: string
      description: string
    }>
  }
  subject: string
  gradeLevel: number
  language: string
  duration?: number // in seconds
  xpReward: number
}

export interface ARSession {
  id: string
  studentId: string
  contentId: string
  startTime: Date
  endTime?: Date
  interactionsCount: number
  questionsAnswered: number
  correctAnswers: number
  xpEarned: number
  completionPercentage: number
}

class ARService {
  private videoElement: HTMLVideoElement | null = null
  private canvasElement: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  private stream: MediaStream | null = null
  private isTracking: boolean = false
  private detectedMarkers: ARMarker[] = []
  private currentSession: ARSession | null = null
  
  // Predefined AR content for different subjects
  private arContentLibrary: Record<string, ARContent[]> = {
    science: [
      {
        id: 'human_heart_3d',
        title: 'Human Heart 3D Model',
        description: 'Explore the chambers and blood flow of the human heart in 3D',
        type: '3d_model',
        modelUrl: '/ar-models/heart.glb',
        subject: 'science',
        gradeLevel: 8,
        language: 'en',
        xpReward: 50,
        interactionData: {
          hotspots: [
            { position: { x: 0, y: 0.2, z: 0 }, label: 'Right Atrium', description: 'Receives deoxygenated blood from the body' },
            { position: { x: 0.1, y: 0.2, z: 0 }, label: 'Left Ventricle', description: 'Pumps oxygenated blood to the body' }
          ]
        }
      },
      {
        id: 'solar_system',
        title: 'Solar System Animation',
        description: 'Watch planets orbit around the sun in real-time',
        type: 'animation',
        subject: 'science',
        gradeLevel: 6,
        language: 'en',
        duration: 120,
        xpReward: 40
      }
    ],
    geography: [
      {
        id: 'india_map_interactive',
        title: 'Interactive Map of India',
        description: 'Explore states, capitals, and geographical features',
        type: 'interactive_quiz',
        subject: 'geography',
        gradeLevel: 7,
        language: 'en',
        xpReward: 45,
        quizData: {
          questions: [
            {
              question: 'What is the capital of Rajasthan?',
              options: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
              correct: 0,
              explanation: 'Jaipur is the capital and largest city of Rajasthan'
            }
          ]
        }
      }
    ],
    mathematics: [
      {
        id: 'geometry_3d_shapes',
        title: '3D Geometric Shapes',
        description: 'Visualize and interact with 3D geometric shapes',
        type: '3d_model',
        subject: 'mathematics',
        gradeLevel: 5,
        language: 'en',
        xpReward: 35
      }
    ]
  }

  // Text/Image markers that trigger AR content
  private markerPatterns: Record<string, string> = {
    'human heart': 'human_heart_3d',
    'heart diagram': 'human_heart_3d',
    'solar system': 'solar_system',
    'india map': 'india_map_interactive',
    'map of india': 'india_map_interactive',
    '3d shapes': 'geometry_3d_shapes',
    'geometric shapes': 'geometry_3d_shapes'
  }

  async initializeCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      throw new Error('Camera access denied or not available')
    }
  }

  setVideoElement(video: HTMLVideoElement): void {
    this.videoElement = video
    if (this.stream) {
      video.srcObject = this.stream
    }
  }

  setCanvasElement(canvas: HTMLCanvasElement): void {
    this.canvasElement = canvas
    this.context = canvas.getContext('2d')
  }

  async startTracking(): Promise<void> {
    if (!this.videoElement || !this.canvasElement || !this.context) {
      throw new Error('Video and canvas elements must be set before starting tracking')
    }

    this.isTracking = true
    this.trackingLoop()
  }

  stopTracking(): void {
    this.isTracking = false
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  private async trackingLoop(): Promise<void> {
    if (!this.isTracking || !this.videoElement || !this.canvasElement || !this.context) {
      return
    }

    // Copy video frame to canvas
    this.context.drawImage(
      this.videoElement,
      0, 0,
      this.canvasElement.width,
      this.canvasElement.height
    )

    // Detect markers in the frame
    await this.detectMarkers()

    // Continue tracking
    requestAnimationFrame(() => this.trackingLoop())
  }

  private async detectMarkers(): Promise<void> {
    if (!this.canvasElement || !this.context) return

    // For now, using a simplified approach
    // In a real implementation, you'd use computer vision libraries
    // like OpenCV.js or TensorFlow.js for robust marker detection
    
    try {
      // Simulate text detection using OCR (would use actual OCR library)
      const detectedText = await this.simulateTextRecognition()
      
      // Check if detected text matches any markers
      const foundMarkers: ARMarker[] = []
      
      for (const text of detectedText) {
        const lowerText = text.toLowerCase()
        for (const [pattern, contentId] of Object.entries(this.markerPatterns)) {
          if (lowerText.includes(pattern)) {
            const content = this.findContentById(contentId)
            if (content) {
              foundMarkers.push({
                id: `marker_${Date.now()}`,
                type: 'text',
                keywords: [pattern],
                confidence: 0.8,
                arContent: content
              })
            }
          }
        }
      }
      
      this.detectedMarkers = foundMarkers
      
      // Trigger AR overlay if markers found
      if (foundMarkers.length > 0) {
        this.onMarkersDetected?.(foundMarkers)
      }
    } catch (error) {
      console.error('Error in marker detection:', error)
    }
  }

  private async simulateTextRecognition(): Promise<string[]> {
    // This would be replaced with actual OCR
    // For demo purposes, returning common educational terms
    const commonTerms = [
      'human heart', 'solar system', 'india map', '3d shapes',
      'triangle', 'circle', 'rectangle', 'photosynthesis',
      'water cycle', 'states of matter'
    ]
    
    // Randomly detect some terms (simulation)
    return commonTerms.filter(() => Math.random() > 0.95)
  }

  private findContentById(contentId: string): ARContent | null {
    for (const subjectContent of Object.values(this.arContentLibrary)) {
      const content = subjectContent.find(c => c.id === contentId)
      if (content) return content
    }
    return null
  }

  getDetectedMarkers(): ARMarker[] {
    return this.detectedMarkers
  }

  getARContentBySubject(subject: string): ARContent[] {
    return this.arContentLibrary[subject] || []
  }

  getAllARContent(): ARContent[] {
    return Object.values(this.arContentLibrary).flat()
  }

  async startARSession(studentId: string, contentId: string): Promise<ARSession> {
    const session: ARSession = {
      id: `session_${Date.now()}`,
      studentId,
      contentId,
      startTime: new Date(),
      interactionsCount: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      xpEarned: 0,
      completionPercentage: 0
    }
    
    this.currentSession = session
    return session
  }

  updateSessionProgress(
    interactions: number = 0,
    questionsAnswered: number = 0,
    correctAnswers: number = 0
  ): void {
    if (this.currentSession) {
      this.currentSession.interactionsCount += interactions
      this.currentSession.questionsAnswered += questionsAnswered
      this.currentSession.correctAnswers += correctAnswers
      
      // Calculate completion percentage
      const content = this.findContentById(this.currentSession.contentId)
      if (content) {
        if (content.type === 'interactive_quiz' && content.quizData) {
          this.currentSession.completionPercentage = 
            (this.currentSession.questionsAnswered / content.quizData.questions.length) * 100
        } else {
          this.currentSession.completionPercentage = 
            Math.min((this.currentSession.interactionsCount / 5) * 100, 100)
        }
        
        // Award XP based on progress
        const progressXP = Math.floor(
          (this.currentSession.completionPercentage / 100) * content.xpReward
        )
        this.currentSession.xpEarned = progressXP
      }
    }
  }

  endARSession(): ARSession | null {
    if (this.currentSession) {
      this.currentSession.endTime = new Date()
      const session = { ...this.currentSession }
      this.currentSession = null
      return session
    }
    return null
  }

  getCurrentSession(): ARSession | null {
    return this.currentSession
  }

  // Event handlers
  onMarkersDetected?: (markers: ARMarker[]) => void
  onSessionUpdate?: (session: ARSession) => void

  // Utility methods for AR content creation
  addCustomContent(content: ARContent): void {
    if (!this.arContentLibrary[content.subject]) {
      this.arContentLibrary[content.subject] = []
    }
    this.arContentLibrary[content.subject].push(content)
  }

  addMarkerPattern(pattern: string, contentId: string): void {
    this.markerPatterns[pattern] = contentId
  }

  // Check device AR capabilities
  static checkARSupport(): {
    camera: boolean
    webgl: boolean
    deviceMotion: boolean
    webxr: boolean
  } {
    return {
      camera: !!navigator.mediaDevices?.getUserMedia,
      webgl: !!document.createElement('canvas').getContext('webgl'),
      deviceMotion: 'DeviceMotionEvent' in window,
      webxr: 'xr' in navigator
    }
  }
}

export const arService = new ARService()