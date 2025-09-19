"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, Lightbulb, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  mood?: string
}

interface LearningTip {
  id: string
  title: string
  content: string
  subject: string
  difficulty: "beginner" | "intermediate" | "advanced"
  emoji: string
}

const learningTips: LearningTip[] = [
  {
    id: "1",
    title: "Math Made Easy",
    content: "Break complex problems into smaller steps. Start with what you know and build from there! 🧮",
    subject: "Mathematics",
    difficulty: "beginner",
    emoji: "🧮",
  },
  {
    id: "2",
    title: "Science Discovery",
    content: "Ask 'why' and 'how' questions about everything around you. Curiosity is your best learning tool! 🔬",
    subject: "Science",
    difficulty: "beginner",
    emoji: "🔬",
  },
  {
    id: "3",
    title: "Reading Comprehension",
    content: "Summarize each paragraph in your own words. This helps you understand and remember better! 📚",
    subject: "English",
    difficulty: "intermediate",
    emoji: "📚",
  },
]

const aiResponses = {
  greeting: [
    "Hello Amandeep! I'm Vidya, your AI learning companion! I'm trained to help you with Mathematics, Science, English, and more. How can I assist you today? 😊",
    "Hi there! Ready to learn something amazing today? I have access to comprehensive educational content and can help with homework, explanations, and study strategies! 🌟",
    "Welcome back! I'm excited to continue our learning journey together! I can provide detailed explanations, solve problems step-by-step, and help you understand complex concepts! 🚀",
  ],
  encouragement: [
    "You're doing great! Every question you ask makes you smarter! I'm here to provide accurate, detailed answers to help you succeed! 💪",
    "I believe in you! Learning takes time, and you're making excellent progress! I can break down any topic into manageable steps! ⭐",
    "That's a wonderful question! Curiosity is the key to learning! Let me give you a comprehensive answer! 🔑",
  ],
  help: [
    "I'm here to help with accurate, detailed explanations! What subject would you like to explore today? I can cover Mathematics, Science, English, History, and more! 🎯",
    "Let's break this down together with step-by-step solutions. What specific topic are you working on? I'll provide comprehensive guidance! 📖",
    "No worries! I'll help you understand this thoroughly. What's challenging you? I can explain concepts, solve problems, and provide examples! 🤔",
  ],
}

export function AIMentorChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentMood, setCurrentMood] = useState<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with greeting
    const greeting: Message = {
      id: "1",
      content: aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)],
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages([greeting])
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Help and difficulty responses
    if (lowerMessage.includes("help") || lowerMessage.includes("stuck") || lowerMessage.includes("difficult")) {
      return aiResponses.help[Math.floor(Math.random() * aiResponses.help.length)]
    }

    // Math responses
    if (lowerMessage.includes("math") || lowerMessage.includes("mathematics") || lowerMessage.includes("algebra") || lowerMessage.includes("geometry") || lowerMessage.includes("calculus") || lowerMessage.includes("trigonometry")) {
      const mathResponses = [
        "Mathematics is the foundation of logical thinking! I can help you with algebra, geometry, calculus, trigonometry, and more. What specific topic would you like to explore? I'll provide step-by-step solutions and explanations! 🧮✨",
        "Math problems are like puzzles waiting to be solved! I can break down complex equations, explain formulas, and help you understand mathematical concepts. What math concept are you working on? 📐",
        "Don't worry, math becomes easier with practice and proper understanding! I can explain any mathematical concept, solve equations step-by-step, and provide practice problems. What would you like help with? 🧮",
        "Math is everywhere in our daily lives! From calculating discounts to understanding scientific formulas. I can help with arithmetic, algebra, geometry, statistics, and advanced topics. What mathematical challenge can we tackle together? 🔢"
      ]
      return mathResponses[Math.floor(Math.random() * mathResponses.length)]
    }

    // Science responses
    if (lowerMessage.includes("science") || lowerMessage.includes("physics") || lowerMessage.includes("chemistry") || lowerMessage.includes("biology") || lowerMessage.includes("experiment") || lowerMessage.includes("molecule") || lowerMessage.includes("atom")) {
      const scienceResponses = [
        "Science is the systematic study of our universe! I can help you understand physics (motion, energy, forces), chemistry (atoms, molecules, reactions), biology (cells, genetics, evolution), and earth science. What specific scientific concept would you like to explore? 🔬🌟",
        "Science is about asking questions and finding evidence-based answers! I can explain scientific phenomena, help with lab reports, and break down complex theories. What scientific topic are you curious about? 🧪",
        "Every great scientist started with curiosity and systematic thinking! I can help you understand scientific concepts, explain experiments, and connect theory to real-world applications. What science topic are you studying? 🌟",
        "Science helps us understand everything from subatomic particles to galaxies! I can explain the scientific method, help with experiments, and make complex concepts accessible. What scientific mystery would you like to solve? 🚀"
      ]
      return scienceResponses[Math.floor(Math.random() * scienceResponses.length)]
    }

    // English responses
    if (lowerMessage.includes("english") || lowerMessage.includes("reading") || lowerMessage.includes("writing") || lowerMessage.includes("grammar")) {
      const englishResponses = [
        "Reading opens up whole new worlds! Are you working on comprehension, writing, or grammar? I have some great tips to share! 📚💡",
        "Language is a powerful tool! Whether it's reading, writing, or speaking, practice makes perfect. What English skill would you like to improve? ✍️",
        "Books are windows to other worlds! What type of reading do you enjoy most? Fiction, non-fiction, or poetry? 📖",
        "Writing is a way to express your thoughts and creativity! What kind of writing are you working on? Essays, stories, or something else? 🖋️"
      ]
      return englishResponses[Math.floor(Math.random() * englishResponses.length)]
    }

    // History responses
    if (lowerMessage.includes("history") || lowerMessage.includes("historical") || lowerMessage.includes("ancient") || lowerMessage.includes("past")) {
      const historyResponses = [
        "History is like a time machine! It helps us understand how we got to where we are today. What historical period interests you? 🏛️",
        "Every historical event has a story behind it! What historical topic are you studying? I can help make it more interesting! 📜",
        "History is full of amazing people and events! From ancient civilizations to modern times, there's so much to learn. What fascinates you? 🗿",
        "Understanding history helps us make better decisions for the future! What historical event would you like to explore? ⏰"
      ]
      return historyResponses[Math.floor(Math.random() * historyResponses.length)]
    }

    // Games and learning responses
    if (lowerMessage.includes("game") || lowerMessage.includes("play") || lowerMessage.includes("fun") || lowerMessage.includes("boring")) {
      const gameResponses = [
        "Learning can be fun when we make it a game! Have you tried our vocabulary challenges or math adventures? They're both educational and entertaining! 🎮",
        "Games make learning more engaging! What type of educational games do you enjoy? Puzzles, quizzes, or interactive stories? 🧩",
        "When learning feels like play, we remember better! Try our science experiments or history detective games - they're both fun and educational! 🎯",
        "Learning through games is one of the best ways to study! Which subject would you like to turn into a game? 🎲"
      ]
      return gameResponses[Math.floor(Math.random() * gameResponses.length)]
    }

    // Emotional support responses
    if (lowerMessage.includes("tired") || lowerMessage.includes("stressed") || lowerMessage.includes("overwhelmed") || lowerMessage.includes("difficult")) {
      const supportResponses = [
        "It's okay to feel that way sometimes! Let's take a short break. Try some deep breathing or a quick walk. Learning is a marathon, not a sprint! 🌸💆‍♀️",
        "Everyone feels overwhelmed sometimes! Remember, you're doing great just by trying. What's one small thing you can do right now? 🌱",
        "Take a deep breath! Learning takes time and patience. What's making you feel stressed? Maybe we can break it down into smaller steps! 🌊",
        "You're stronger than you think! When things get tough, remember all the challenges you've already overcome. What can I help you with? 💪"
      ]
      return supportResponses[Math.floor(Math.random() * supportResponses.length)]
    }

    // Positive responses
    if (lowerMessage.includes("good") || lowerMessage.includes("great") || lowerMessage.includes("awesome") || lowerMessage.includes("excellent")) {
      return aiResponses.encouragement[Math.floor(Math.random() * aiResponses.encouragement.length)]
    }

    // Study tips and strategies
    if (lowerMessage.includes("study") || lowerMessage.includes("learn") || lowerMessage.includes("remember") || lowerMessage.includes("focus")) {
      const studyResponses = [
        "Great study habits make all the difference! Try the Pomodoro technique: 25 minutes of focused study, then a 5-minute break. What study method works best for you? ⏰",
        "Active learning is more effective than passive reading! Try summarizing what you learn in your own words, or teach it to someone else. What subject are you studying? 📝",
        "Spaced repetition helps you remember better! Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. What are you trying to memorize? 🧠",
        "Find your learning style! Some people learn better by seeing (visual), hearing (auditory), or doing (kinesthetic). What works best for you? 🎨"
      ]
      return studyResponses[Math.floor(Math.random() * studyResponses.length)]
    }

    // Specific problem-solving responses
    if (lowerMessage.includes("solve") || lowerMessage.includes("problem") || lowerMessage.includes("equation") || lowerMessage.includes("formula")) {
      const problemResponses = [
        "I'd love to help you solve that problem! Please share the specific equation, problem statement, or question you're working on, and I'll provide a step-by-step solution with explanations! 🧮",
        "Problem-solving is one of my strengths! I can work through math equations, science problems, and logical puzzles. What specific problem would you like me to help you solve? 🔍",
        "Let's tackle this problem together! I can break it down into manageable steps and explain each part clearly. What problem are you trying to solve? 💡",
        "I'm ready to help you work through any problem! Whether it's a math equation, science experiment, or writing assignment, I can provide detailed guidance. What's the challenge? 🎯"
      ]
      return problemResponses[Math.floor(Math.random() * problemResponses.length)]
    }

    // Homework help responses
    if (lowerMessage.includes("homework") || lowerMessage.includes("assignment") || lowerMessage.includes("project")) {
      const homeworkResponses = [
        "I'm here to help with your homework! I can assist with math problems, science questions, essay writing, and more. What specific assignment are you working on? 📝",
        "Homework help is one of my specialties! I can provide step-by-step solutions, explain concepts, and help you understand the material. What subject is your assignment in? 📚",
        "Let's work through your homework together! I can help you understand the concepts and guide you to the right answers. What assignment are you struggling with? ✍️",
        "I'm ready to help you succeed with your homework! Whether it's solving equations, writing essays, or understanding scientific concepts, I'm here to support you. What do you need help with? 🎓"
      ]
      return homeworkResponses[Math.floor(Math.random() * homeworkResponses.length)]
    }

    // Default responses with more variety
    const defaultResponses = [
      "That's a great question! I'm trained to provide accurate, detailed answers across all subjects. What specific topic would you like to explore? 🤔",
      "I love your curiosity! I can help with mathematics, science, English, history, and more. What would you like to learn about today? 📖",
      "Excellent question! I'm here to provide comprehensive explanations and step-by-step solutions. What subject area interests you? 🔍",
      "You're on the right track! I can help with homework, explain complex concepts, and provide practice problems. What specific help do you need? 🎯",
      "I'm here to help you succeed academically! I can assist with problem-solving, concept explanations, and study strategies. What learning challenge can we tackle together? 🚀",
      "Every question is a step toward understanding! I'm trained to provide accurate, detailed answers. What would you like to explore? 🌟",
      "Learning is an adventure! I can help with any subject from basic concepts to advanced topics. What new knowledge are you seeking today? 🗺️",
      "Your curiosity is your superpower! I'm ready to provide comprehensive answers and explanations. What topic sparks your interest? ⚡"
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      toast({
        title: "AI Mentor Response",
        description: "Vidya has responded to your message!",
      })
    }, 1500)
  }

  const selectMood = (mood: string) => {
    setCurrentMood(mood)
    const moodMessage: Message = {
      id: Date.now().toString(),
      content: `I'm feeling ${mood} today`,
      sender: "user",
      timestamp: new Date(),
      mood,
    }

    setMessages((prev) => [...prev, moodMessage])

    // AI responds to mood
    setTimeout(() => {
      let response = ""
      switch (mood) {
        case "excited":
          response =
            "That's wonderful! Your excitement will help you learn faster. What would you like to explore today? 🚀"
          break
        case "confused":
          response = "It's perfectly normal to feel confused sometimes. Let's work through it together step by step! 🤝"
          break
        case "tired":
          response =
            "When we're tired, it's harder to focus. Maybe we should start with something fun and easy today? 😴"
          break
        case "motivated":
          response =
            "I love your motivation! Let's channel that energy into some challenging but rewarding learning! 💪"
          break
        default:
          response = "Thank you for sharing how you feel. I'm here to support you no matter what! 💙"
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* AI Mentor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/friendly-ai-mentor-avatar.jpg" alt="Vidya AI Mentor" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">V</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Vidya - Your AI Learning Companion
              </CardTitle>
              <p className="text-muted-foreground">Always here to help you learn and grow! 🌟</p>
              <Badge variant="secondary" className="mt-2">
                Online & Ready to Help
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mood Check */}
      {!currentMood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { mood: "excited", emoji: "😄", color: "bg-yellow-100 hover:bg-yellow-200" },
                { mood: "confused", emoji: "😕", color: "bg-blue-100 hover:bg-blue-200" },
                { mood: "tired", emoji: "😴", color: "bg-purple-100 hover:bg-purple-200" },
                { mood: "motivated", emoji: "💪", color: "bg-green-100 hover:bg-green-200" },
              ].map(({ mood, emoji, color }) => (
                <Button
                  key={mood}
                  variant="outline"
                  className={`h-20 flex-col gap-2 ${color}`}
                  onClick={() => selectMood(mood)}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="capitalize">{mood}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Chat with Vidya
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Vidya is typing...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Vidya anything about your studies..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Today's Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {learningTips.map((tip) => (
              <div key={tip.id} className="p-4 bg-muted rounded-lg border">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{tip.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {tip.subject}
                      </Badge>
                      <Badge
                        variant={
                          tip.difficulty === "beginner"
                            ? "secondary"
                            : tip.difficulty === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {tip.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
