import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  doc,
  getDoc 
} from 'firebase/firestore'

export interface QuestStep {
  id: string
  type: 'problem' | 'story' | 'choice' | 'challenge'
  title: string
  description: string
  content: string
  subject: string
  difficulty: number
  xpReward: number
  problemData?: {
    question: string
    options?: string[]
    correctAnswer: string | number
    explanation: string
    hints: string[]
  }
  storyData?: {
    narrative: string
    characterDialogue: string
    sceneDescription: string
    nextStepCondition: string
  }
  choiceData?: {
    choices: Array<{
      text: string
      consequence: string
      nextStepId?: string
      xpModifier: number
    }>
  }
  completed: boolean
  unlockedAt?: Date
}

export interface LearningQuest {
  id: string
  title: string
  description: string
  theme: string // e.g., "Space Explorer", "Time Traveler", "Nature Detective"
  storyline: string
  totalSteps: number
  currentStep: number
  subject: string
  gradeLevel: number
  estimatedDuration: number // in minutes
  xpTotal: number
  xpEarned: number
  steps: QuestStep[]
  isActive: boolean
  completedAt?: Date
  createdAt: Date
  studentId: string
  generatedBy: 'ai' | 'teacher'
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  language: string
}

// Quest themes for different subjects
const QUEST_THEMES = {
  mathematics: [
    'Galactic Math Explorer',
    'Number Detective Agency', 
    'Calculator Kingdom',
    'Geometry Garden Adventure',
    'Fraction Forest Quest'
  ],
  science: [
    'Laboratory Time Traveler',
    'Ecosystem Explorer',
    'Chemical Reaction Hero',
    'Space Mission Commander',
    'Body System Investigator'
  ],
  history: [
    'Time Portal Historian',
    'Ancient Civilization Detective',
    'Freedom Fighter Chronicles',
    'Cultural Heritage Guardian',
    'Monument Mystery Solver'
  ],
  geography: [
    'World Explorer Navigator',
    'Climate Change Investigator',
    'Mountain Expedition Leader',
    'Ocean Depth Explorer',
    'City Planning Architect'
  ],
  english: [
    'Word Wizard Academy',
    'Story Weaver Chronicles',
    'Grammar Guardian Quest',
    'Poetry Planet Explorer',
    'Literature Time Machine'
  ]
}

// Story templates for different themes
const STORY_TEMPLATES = {
  'Space Explorer': {
    intro: "You are Commander {studentName}, leading a crucial mission to Planet {randomPlanet}. Your spaceship's navigation system needs {subject} calculations to succeed!",
    progressNarrative: "As you journey through the cosmos, each {subject} challenge brings you closer to discovering the secrets of {randomPlanet}.",
    conclusion: "Your mastery of {subject} has saved the mission! The inhabitants of {randomPlanet} welcome you as their hero."
  },
  'Time Traveler': {
    intro: "Professor {studentName}, your time machine is malfunctioning! You need to solve {subject} puzzles to fix it and return to your own era.",
    progressNarrative: "Each {subject} solution repairs another component of your time machine, bringing you closer to home.",
    conclusion: "Your {subject} expertise has fixed the time machine! You've returned safely with valuable knowledge from the past."
  },
  'Detective': {
    intro: "Detective {studentName}, a mysterious case requires your {subject} skills to solve! Follow the clues and crack the code.",
    progressNarrative: "Each {subject} clue you solve reveals more about the mystery, bringing you closer to the truth.",
    conclusion: "Your brilliant {subject} deductions have solved the case! The mystery is finally revealed."
  }
}

class AIQuestService {
  private async generateQuestSteps(
    subject: string, 
    gradeLevel: number, 
    difficulty: string,
    theme: string,
    language: string,
    studentName: string
  ): Promise<QuestStep[]> {
    // This would integrate with actual AI service (OpenAI, Gemini, etc.)
    // For now, using predefined intelligent templates
    
    const steps: QuestStep[] = []
    const numSteps = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10
    
    for (let i = 0; i < numSteps; i++) {
      const step = this.generateSingleStep(subject, gradeLevel, difficulty, theme, i, language, studentName)
      steps.push(step)
    }
    
    return steps
  }

  private generateSingleStep(
    subject: string, 
    gradeLevel: number, 
    difficulty: string, 
    theme: string,
    stepIndex: number,
    language: string,
    studentName: string
  ): QuestStep {
    const stepTypes: Array<QuestStep['type']> = ['problem', 'story', 'choice', 'challenge']
    const type = stepIndex % 3 === 0 ? 'story' : stepIndex % 4 === 1 ? 'choice' : 'problem'
    
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2
    const baseXP = 25 * difficultyMultiplier
    
    const step: QuestStep = {
      id: `step_${stepIndex + 1}`,
      type,
      title: this.generateStepTitle(subject, theme, stepIndex + 1, language),
      description: this.generateStepDescription(subject, theme, stepIndex + 1, type, language),
      content: this.generateStepContent(subject, gradeLevel, theme, stepIndex + 1, language, studentName),
      subject,
      difficulty: gradeLevel,
      xpReward: Math.round(baseXP * (stepIndex + 1) * 0.2),
      completed: false,
      unlockedAt: stepIndex === 0 ? new Date() : undefined
    }

    // Add type-specific data
    if (type === 'problem') {
      step.problemData = this.generateProblemData(subject, gradeLevel, difficulty, theme, language)
    } else if (type === 'story') {
      step.storyData = this.generateStoryData(theme, stepIndex + 1, language, studentName)
    } else if (type === 'choice') {
      step.choiceData = this.generateChoiceData(subject, theme, stepIndex + 1, language)
    }

    return step
  }

  private generateStepTitle(subject: string, theme: string, stepNumber: number, language: string): string {
    const titles = {
      en: {
        'Space Explorer': [`Mission Briefing`, `Navigation Challenge`, `Asteroid Field`, `Planet Analysis`, `Final Approach`],
        'Time Traveler': [`Time Portal Opens`, `Ancient Mathematics`, `Historical Puzzle`, `Timeline Crisis`, `Return Journey`],
        'Detective': [`Crime Scene`, `First Clue`, `Witness Interview`, `Evidence Analysis`, `Case Closed`]
      },
      hi: {
        'Space Explorer': [`मिशन ब्रीफिंग`, `नेवीगेशन चुनौती`, `उल्का क्षेत्र`, `ग्रह विश्लेषण`, `अंतिम दृष्टिकोण`],
        'Time Traveler': [`समय पोर्टल खुलता है`, `प्राचीन गणित`, `ऐतिहासिक पहेली`, `समयरेखा संकट`, `वापसी यात्रा`],
        'Detective': [`अपराध स्थल`, `पहला सुराग`, `गवाह साक्षात्कार`, `सबूत विश्लेषण`, `मामला बंद`]
      },
      or: {
        'Space Explorer': [`ମିସନ୍ ବ୍ରିଫିଂ`, `ନେଭିଗେସନ୍ ଚ୍ୟାଲେଞ୍ଜ`, `ଆଷ୍ଟେରଏଡ୍ ଫିଲ୍ଡ`, `ପ୍ଲାନେଟ୍ ଆନାଲାଇସିସ୍`, `ଫାଇନାଲ୍ ଆପ୍ରୋଚ୍`],
        'Time Traveler': [`ଟାଇମ୍ ପୋର୍ଟାଲ୍ ଖୋଲେ`, `ପ୍ରାଚୀନ ଗଣିତ`, `ଐତିହାସିକ ପଜଲ୍`, `ଟାଇମଲାଇନ୍ କ୍ରାଇସିସ୍`, `ରିଟର୍ନ ଯାତ୍ରା`],
        'Detective': [`କ୍ରାଇମ୍ ଦୃଶ୍ୟ`, `ପ୍ରଥମ ସୁତ୍ର`, `ସାକ୍ଷୀ ସାକ୍ଷାତକାର`, `ପ୍ରମାଣ ବିଶ୍ଳେଷଣ`, `କେସ୍ ବନ୍ଦ`]
      }
    }
    
    const langTitles = titles[language as keyof typeof titles] || titles.en
    const themeTitles = langTitles[theme as keyof typeof langTitles] || langTitles['Space Explorer']
    return themeTitles[(stepNumber - 1) % themeTitles.length] || `Step ${stepNumber}`
  }

  private generateStepDescription(subject: string, theme: string, stepNumber: number, type: QuestStep['type'], language: string): string {
    const descriptions = {
      en: {
        problem: `Solve this ${subject} challenge to continue your ${theme} adventure!`,
        story: `Discover what happens next in your ${theme} journey!`,
        choice: `Make a crucial decision that will affect your ${theme} mission!`,
        challenge: `Face an exciting ${subject} challenge in your ${theme} quest!`
      },
      hi: {
        problem: `अपने ${theme} रोमांच को जारी रखने के लिए इस ${subject} चुनौती को हल करें!`,
        story: `अपनी ${theme} यात्रा में आगे क्या होता है, यह जानें!`,
        choice: `एक महत्वपूर्ण निर्णय लें जो आपके ${theme} मिशन को प्रभावित करेगा!`,
        challenge: `अपनी ${theme} खोज में एक रोमांचक ${subject} चुनौती का सामना करें!`
      },
      or: {
        problem: `ଆପଣଙ୍କର ${theme} ଦୁସ୍ସାହସିକ କାର୍ଯ୍ୟ ଜାରି ରଖିବାକୁ ଏହି ${subject} ଚ୍ୟାଲେଞ୍ଜର ସମାଧାନ କରନ୍ତୁ!`,
        story: `ଆପଣଙ୍କର ${theme} ଯାତ୍ରାରେ ଆଗକୁ କଣ ହୁଏ ଜାଣନ୍ତୁ!`,
        choice: `ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ ଯାହା ଆପଣଙ୍କ ${theme} ମିସନକୁ ପ୍ରଭାବିତ କରିବ!`,
        challenge: `ଆପଣଙ୍କର ${theme} ଅନୁସନ୍ଧାନରେ ଏକ ରୋମାଞ୍ଚକର ${subject} ଚ୍ୟାଲେଞ୍ଜର ସମ୍ମୁଖୀନ ହୁଅନ୍ତୁ!`
      }
    }
    
    const langDesc = descriptions[language as keyof typeof descriptions] || descriptions.en
    return langDesc[type]
  }

  private generateStepContent(subject: string, gradeLevel: number, theme: string, stepNumber: number, language: string, studentName: string): string {
    // Generate immersive story content based on theme and step
    const content = {
      en: `Welcome, ${studentName}! You've reached Step ${stepNumber} of your ${theme} adventure. Your ${subject} skills are crucial for what lies ahead...`,
      hi: `स्वागत है, ${studentName}! आप अपने ${theme} रोमांच के चरण ${stepNumber} पर पहुँच गए हैं। आपके ${subject} कौशल आगे के लिए महत्वपूर्ण हैं...`,
      or: `ସ୍ୱାଗତ, ${studentName}! ଆପଣ ଆପଣଙ୍କର ${theme} ଦୁସ୍ସାହସିକ କାର୍ଯ୍ୟର ଷ୍ଟେପ୍ ${stepNumber} ରେ ପହଞ୍ଚିଛନ୍ତି। ଆପଣଙ୍କର ${subject} ଦକ୍ଷତା ଆଗାମୀ ପାଇଁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ...`
    }
    
    return content[language as keyof typeof content] || content.en
  }

  private generateProblemData(subject: string, gradeLevel: number, difficulty: string, theme: string, language: string) {
    // This would be enhanced with actual curriculum-based problem generation
    const problems = {
      mathematics: {
        easy: {
          en: {
            question: "Your spaceship needs 15 fuel units. You have 8 units. How many more do you need?",
            options: ["7", "23", "5", "9"],
            correctAnswer: "7",
            explanation: "15 - 8 = 7 fuel units needed",
            hints: ["Subtract what you have from what you need", "15 - 8 = ?"]
          }
        }
      }
    }
    
    // Return default problem structure - would be enhanced with AI generation
    return {
      question: `Solve this ${subject} problem to continue your adventure!`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "This is the correct answer because...",
      hints: ["Think about the problem step by step", "Consider what you learned in class"]
    }
  }

  private generateStoryData(theme: string, stepNumber: number, language: string, studentName: string) {
    return {
      narrative: `In this part of your ${theme} adventure, you discover something amazing...`,
      characterDialogue: `"Well done, ${studentName}! You're making excellent progress!"`,
      sceneDescription: "The scene unfolds with new challenges and discoveries...",
      nextStepCondition: "Complete the challenge to unlock the next part of your story!"
    }
  }

  private generateChoiceData(subject: string, theme: string, stepNumber: number, language: string) {
    return {
      choices: [
        {
          text: "Use advanced calculations to solve the problem",
          consequence: "Your mathematical approach leads to a breakthrough!",
          xpModifier: 1.2
        },
        {
          text: "Try a creative alternative solution",
          consequence: "Your innovative thinking opens up new possibilities!",
          xpModifier: 1.1
        },
        {
          text: "Ask for help from your AI companion",
          consequence: "Teamwork makes the solution clearer!",
          xpModifier: 1.0
        }
      ]
    }
  }

  async generatePersonalizedQuest(
    studentId: string,
    subject: string,
    gradeLevel: number,
    difficulty: 'easy' | 'medium' | 'hard',
    language: string = 'en',
    studentName: string = 'Explorer'
  ): Promise<LearningQuest> {
    // Select appropriate theme for subject
    const themes = QUEST_THEMES[subject as keyof typeof QUEST_THEMES] || QUEST_THEMES.mathematics
    const theme = themes[Math.floor(Math.random() * themes.length)]
    
    // Generate quest steps
    const steps = await this.generateQuestSteps(subject, gradeLevel, difficulty, theme, language, studentName)
    
    const quest: LearningQuest = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${theme}: ${subject.charAt(0).toUpperCase() + subject.slice(1)} Adventure`,
      description: `Embark on an epic ${theme} journey while mastering ${subject} concepts!`,
      theme,
      storyline: this.generateStoryline(theme, subject, studentName, language),
      totalSteps: steps.length,
      currentStep: 0,
      subject,
      gradeLevel,
      estimatedDuration: steps.length * 5, // 5 minutes per step
      xpTotal: steps.reduce((total, step) => total + step.xpReward, 0),
      xpEarned: 0,
      steps,
      isActive: false,
      createdAt: new Date(),
      studentId,
      generatedBy: 'ai',
      tags: [subject, theme, difficulty, `grade-${gradeLevel}`],
      difficulty,
      language
    }

    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, 'learning_quests'), quest)
      quest.id = docRef.id
      await updateDoc(docRef, { id: docRef.id })
    } catch (error) {
      console.error('Error saving quest:', error)
    }

    return quest
  }

  private generateStoryline(theme: string, subject: string, studentName: string, language: string): string {
    const template = STORY_TEMPLATES[theme as keyof typeof STORY_TEMPLATES] || STORY_TEMPLATES['Space Explorer']
    const randomPlanet = ['Mathovia', 'Scientifica', 'Historica', 'Linguistica'][Math.floor(Math.random() * 4)]
    
    return template.intro
      .replace('{studentName}', studentName)
      .replace('{subject}', subject)
      .replace('{randomPlanet}', randomPlanet)
  }

  async getStudentQuests(studentId: string): Promise<LearningQuest[]> {
    try {
      const q = query(
        collection(db, 'learning_quests'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LearningQuest))
    } catch (error) {
      console.error('Error fetching quests:', error)
      return []
    }
  }

  async updateQuestProgress(questId: string, stepId: string, success: boolean, xpEarned: number): Promise<void> {
    try {
      const questRef = doc(db, 'learning_quests', questId)
      const questDoc = await getDoc(questRef)
      
      if (questDoc.exists()) {
        const quest = questDoc.data() as LearningQuest
        const stepIndex = quest.steps.findIndex(step => step.id === stepId)
        
        if (stepIndex !== -1) {
          // Mark current step as completed
          quest.steps[stepIndex].completed = true
          quest.xpEarned += xpEarned
          
          // Unlock next step
          if (stepIndex + 1 < quest.steps.length) {
            quest.steps[stepIndex + 1].unlockedAt = new Date()
            quest.currentStep = stepIndex + 1
          } else {
            // Quest completed
            quest.completedAt = new Date()
            quest.isActive = false
          }
          
          await updateDoc(questRef, {
            steps: quest.steps,
            currentStep: quest.currentStep,
            xpEarned: quest.xpEarned,
            completedAt: quest.completedAt,
            isActive: quest.isActive
          })
        }
      }
    } catch (error) {
      console.error('Error updating quest progress:', error)
    }
  }

  async activateQuest(questId: string): Promise<void> {
    try {
      const questRef = doc(db, 'learning_quests', questId)
      await updateDoc(questRef, { isActive: true })
    } catch (error) {
      console.error('Error activating quest:', error)
    }
  }
}

export const aiQuestService = new AIQuestService()