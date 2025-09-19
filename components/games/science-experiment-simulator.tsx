"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FlaskConical, 
  Atom, 
  Zap, 
  Droplets, 
  Flame, 
  Snowflake,
  Lightbulb,
  Target,
  Star,
  Trophy,
  Play,
  RotateCcw,
  Eye,
  BookOpen,
  TestTube
} from "lucide-react"

interface Element {
  id: string
  name: string
  symbol: string
  atomicNumber: number
  category: "metal" | "nonmetal" | "metalloid" | "noble-gas"
  color: string
  properties: string[]
  reactivity: "low" | "medium" | "high"
  state: "solid" | "liquid" | "gas"
}

interface Reaction {
  id: string
  name: string
  reactants: string[]
  products: string[]
  equation: string
  type: "combination" | "decomposition" | "single-replacement" | "double-replacement" | "combustion"
  energyChange: "exothermic" | "endothermic"
  description: string
  realWorldExample: string
  safetyNotes: string[]
  xpReward: number
}

interface Experiment {
  id: string
  name: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  elements: Element[]
  expectedReaction?: Reaction
  instructions: string[]
  observations: string[]
  safetyEquipment: string[]
  xpReward: number
  unlocked: boolean
  completed: boolean
}

interface LabState {
  selectedElements: Element[]
  currentReaction: Reaction | null
  experimentHistory: Reaction[]
  score: number
  level: number
  xp: number
}

export function ScienceExperimentSimulator() {
  const [activeTab, setActiveTab] = useState<string>("elements")
  const [selectedElements, setSelectedElements] = useState<Element[]>([])
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null)
  const [showReaction, setShowReaction] = useState(false)
  const [labState, setLabState] = useState<LabState>({
    selectedElements: [],
    currentReaction: null,
    experimentHistory: [],
    score: 0,
    level: 1,
    xp: 0
  })
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [experimentStep, setExperimentStep] = useState(0)

  const elements: Element[] = [
    {
      id: "H",
      name: "Hydrogen",
      symbol: "H",
      atomicNumber: 1,
      category: "nonmetal",
      color: "bg-pink-200",
      properties: ["Colorless", "Odorless", "Highly flammable"],
      reactivity: "high",
      state: "gas"
    },
    {
      id: "O",
      name: "Oxygen",
      symbol: "O",
      atomicNumber: 8,
      category: "nonmetal",
      color: "bg-red-200",
      properties: ["Colorless", "Odorless", "Supports combustion"],
      reactivity: "high",
      state: "gas"
    },
    {
      id: "Na",
      name: "Sodium",
      symbol: "Na",
      atomicNumber: 11,
      category: "metal",
      color: "bg-yellow-200",
      properties: ["Soft", "Silvery", "Highly reactive"],
      reactivity: "high",
      state: "solid"
    },
    {
      id: "Cl",
      name: "Chlorine",
      symbol: "Cl",
      atomicNumber: 17,
      category: "nonmetal",
      color: "bg-green-200",
      properties: ["Yellow-green gas", "Toxic", "Strong oxidizing agent"],
      reactivity: "high",
      state: "gas"
    },
    {
      id: "Fe",
      name: "Iron",
      symbol: "Fe",
      atomicNumber: 26,
      category: "metal",
      color: "bg-gray-300",
      properties: ["Magnetic", "Corrodes easily", "Good conductor"],
      reactivity: "medium",
      state: "solid"
    },
    {
      id: "Cu",
      name: "Copper",
      symbol: "Cu",
      atomicNumber: 29,
      category: "metal",
      color: "bg-orange-200",
      properties: ["Excellent conductor", "Corrosion resistant", "Malleable"],
      reactivity: "low",
      state: "solid"
    },
    {
      id: "C",
      name: "Carbon",
      symbol: "C",
      atomicNumber: 6,
      category: "nonmetal",
      color: "bg-gray-400",
      properties: ["Forms many compounds", "Essential for life", "Multiple allotropes"],
      reactivity: "medium",
      state: "solid"
    },
    {
      id: "He",
      name: "Helium",
      symbol: "He",
      atomicNumber: 2,
      category: "noble-gas",
      color: "bg-blue-200",
      properties: ["Inert", "Lightest noble gas", "Non-reactive"],
      reactivity: "low",
      state: "gas"
    }
  ]

  const reactions: Reaction[] = [
    {
      id: "water-formation",
      name: "Water Formation",
      reactants: ["H", "O"],
      products: ["H2O"],
      equation: "2H₂ + O₂ → 2H₂O",
      type: "combination",
      energyChange: "exothermic",
      description: "Hydrogen and oxygen combine to form water, releasing energy",
      realWorldExample: "This reaction powers rocket engines and fuel cells",
      safetyNotes: ["Produces heat", "Use proper ventilation"],
      xpReward: 50
    },
    {
      id: "salt-formation",
      name: "Salt Formation",
      reactants: ["Na", "Cl"],
      products: ["NaCl"],
      equation: "2Na + Cl₂ → 2NaCl",
      type: "combination",
      energyChange: "exothermic",
      description: "Sodium and chlorine react violently to form table salt",
      realWorldExample: "This is how table salt is produced industrially",
      safetyNotes: ["Extremely violent reaction", "Do not attempt in real lab"],
      xpReward: 75
    },
    {
      id: "rust-formation",
      name: "Rust Formation",
      reactants: ["Fe", "O"],
      products: ["Fe2O3"],
      equation: "4Fe + 3O₂ → 2Fe₂O₃",
      type: "combination",
      energyChange: "exothermic",
      description: "Iron reacts with oxygen to form iron oxide (rust)",
      realWorldExample: "This is why iron objects rust when exposed to air and moisture",
      safetyNotes: ["Slow reaction", "Requires moisture"],
      xpReward: 40
    },
    {
      id: "combustion",
      name: "Combustion",
      reactants: ["C", "O"],
      products: ["CO2"],
      equation: "C + O₂ → CO₂",
      type: "combustion",
      energyChange: "exothermic",
      description: "Carbon burns in oxygen to form carbon dioxide",
      realWorldExample: "This happens when you burn wood or coal",
      safetyNotes: ["Produces heat and light", "Requires ignition source"],
      xpReward: 60
    }
  ]

  const experiments: Experiment[] = [
    {
      id: "water-lab",
      name: "Water Formation Lab",
      description: "Create water by combining hydrogen and oxygen",
      difficulty: "beginner",
      elements: [elements[0], elements[1]], // H, O
      expectedReaction: reactions[0],
      instructions: [
        "Select hydrogen (H) and oxygen (O) elements",
        "Combine them in the reaction chamber",
        "Observe the exothermic reaction",
        "Note the formation of water molecules"
      ],
      observations: [
        "Bright flash of light",
        "Heat is released",
        "Water droplets form",
        "Steam is produced"
      ],
      safetyEquipment: ["Safety goggles", "Heat-resistant gloves", "Ventilation"],
      xpReward: 100,
      unlocked: true,
      completed: false
    },
    {
      id: "salt-lab",
      name: "Salt Formation Lab",
      description: "Create table salt from sodium and chlorine",
      difficulty: "intermediate",
      elements: [elements[2], elements[3]], // Na, Cl
      expectedReaction: reactions[1],
      instructions: [
        "Select sodium (Na) and chlorine (Cl) elements",
        "Combine them carefully in the reaction chamber",
        "Observe the violent exothermic reaction",
        "Note the formation of sodium chloride crystals"
      ],
      observations: [
        "Intense yellow flame",
        "Loud popping sound",
        "White smoke",
        "Crystalline salt forms"
      ],
      safetyEquipment: ["Full face shield", "Fire-resistant lab coat", "Emergency shower"],
      xpReward: 150,
      unlocked: true,
      completed: false
    },
    {
      id: "rust-lab",
      name: "Rust Formation Lab",
      description: "Observe iron rusting in the presence of oxygen",
      difficulty: "beginner",
      elements: [elements[4], elements[1]], // Fe, O
      expectedReaction: reactions[2],
      instructions: [
        "Select iron (Fe) and oxygen (O) elements",
        "Add moisture to accelerate the reaction",
        "Observe the slow oxidation process",
        "Note the color change to reddish-brown"
      ],
      observations: [
        "Gradual color change",
        "Surface becomes rough",
        "Reddish-brown coating",
        "Weak magnetic properties"
      ],
      safetyEquipment: ["Safety goggles", "Lab coat"],
      xpReward: 80,
      unlocked: true,
      completed: false
    }
  ]

  const addElement = (element: Element) => {
    if (selectedElements.length < 3 && !selectedElements.find(e => e.id === element.id)) {
      setSelectedElements([...selectedElements, element])
    }
  }

  const removeElement = (elementId: string) => {
    setSelectedElements(selectedElements.filter(e => e.id !== elementId))
  }

  const combineElements = () => {
    if (selectedElements.length < 2) return

    const elementSymbols = selectedElements.map(e => e.symbol).sort()
    const possibleReaction = reactions.find(reaction => {
      const reactionElements = reaction.reactants.sort()
      return JSON.stringify(reactionElements) === JSON.stringify(elementSymbols)
    })

    if (possibleReaction) {
      setCurrentReaction(possibleReaction)
      setShowReaction(true)
      setLabState(prev => ({
        ...prev,
        currentReaction: possibleReaction,
        experimentHistory: [...prev.experimentHistory, possibleReaction],
        xp: prev.xp + possibleReaction.xpReward,
        score: prev.score + possibleReaction.xpReward
      }))
    } else {
      setCurrentReaction(null)
      setShowReaction(true)
    }

    setSelectedElements([])
  }

  const startExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment)
    setExperimentStep(0)
    setActiveTab("experiment")
  }

  const nextExperimentStep = () => {
    if (selectedExperiment && experimentStep < selectedExperiment.instructions.length - 1) {
      setExperimentStep(experimentStep + 1)
    }
  }

  const completeExperiment = () => {
    if (selectedExperiment) {
      setLabState(prev => ({
        ...prev,
        xp: prev.xp + selectedExperiment.xpReward,
        score: prev.score + selectedExperiment.xpReward
      }))
      setSelectedExperiment(null)
      setExperimentStep(0)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "metal": return "bg-yellow-100 text-yellow-800"
      case "nonmetal": return "bg-green-100 text-green-800"
      case "metalloid": return "bg-purple-100 text-purple-800"
      case "noble-gas": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getReactivityColor = (reactivity: string) => {
    switch (reactivity) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🧪 Science Experiment Simulator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore chemistry through interactive experiments, element combinations, and real-world reactions
          </p>
        </div>

        {/* Lab Stats */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">👨‍🔬</div>
                <div>
                  <h3 className="text-xl font-bold">Lab Scientist</h3>
                  <p className="text-purple-100">Level {labState.level} Researcher</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{labState.xp}</div>
                  <div className="text-sm text-purple-100">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{labState.score}</div>
                  <div className="text-sm text-purple-100">Lab Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{labState.experimentHistory.length}</div>
                  <div className="text-sm text-purple-100">Experiments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{elements.length}</div>
                  <div className="text-sm text-purple-100">Elements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="reactions">Reactions</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {elements.map((element) => (
                <Card key={element.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => addElement(element)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-full ${element.color} flex items-center justify-center text-lg font-bold`}>
                        {element.symbol}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{element.name}</div>
                        <div className="text-xs text-muted-foreground">#{element.atomicNumber}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge className={getCategoryColor(element.category)}>
                      {element.category}
                    </Badge>
                    <Badge className={getReactivityColor(element.reactivity)}>
                      {element.reactivity} reactivity
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      State: {element.state}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Elements */}
            {selectedElements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Elements</CardTitle>
                  <CardDescription>Combine elements to create reactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-center">
                    {selectedElements.map((element, index) => (
                      <div key={element.id} className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full ${element.color} flex items-center justify-center font-bold`}>
                          {element.symbol}
                        </div>
                        {index < selectedElements.length - 1 && <span className="text-2xl">+</span>}
                      </div>
                    ))}
                    <Button onClick={combineElements} className="ml-4">
                      <Zap className="h-4 w-4 mr-2" />
                      Combine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reaction Result */}
            {showReaction && (
              <Card className={currentReaction ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <CardTitle className={currentReaction ? "text-green-600" : "text-red-600"}>
                    {currentReaction ? "Reaction Successful!" : "No Reaction"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentReaction ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800">{currentReaction.name}</h4>
                        <p className="text-green-700 text-sm mt-1">{currentReaction.description}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-mono bg-gray-100 p-3 rounded">
                          {currentReaction.equation}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium">Real-world Example:</h5>
                          <p className="text-sm text-muted-foreground">{currentReaction.realWorldExample}</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Energy Change:</h5>
                          <Badge className={currentReaction.energyChange === "exothermic" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                            {currentReaction.energyChange === "exothermic" ? "🔥 Exothermic" : "❄️ Endothermic"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">+{currentReaction.xpReward} XP</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-red-600">
                      <p>These elements don't react under normal conditions.</p>
                      <p className="text-sm text-muted-foreground mt-2">Try different combinations!</p>
                    </div>
                  )}
                  <Button onClick={() => setShowReaction(false)} className="w-full mt-4">
                    Continue Experimenting
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reactions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reactions.map((reaction) => (
                <Card key={reaction.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{reaction.name}</CardTitle>
                    <CardDescription>{reaction.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-xl font-mono bg-gray-100 p-3 rounded">
                        {reaction.equation}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{reaction.type}</Badge>
                      <Badge className={reaction.energyChange === "exothermic" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                        {reaction.energyChange}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{reaction.realWorldExample}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{reaction.xpReward} XP</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experiments.map((experiment) => (
                <Card key={experiment.id} className={!experiment.unlocked ? "opacity-50" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{experiment.name}</CardTitle>
                    <CardDescription>{experiment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">{experiment.difficulty}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {experiment.elements.length} elements
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Required Elements:</h5>
                      <div className="flex gap-2">
                        {experiment.elements.map((element) => (
                          <div key={element.id} className={`w-8 h-8 rounded-full ${element.color} flex items-center justify-center text-xs font-bold`}>
                            {element.symbol}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{experiment.xpReward} XP</span>
                    </div>
                    <Button 
                      onClick={() => startExperiment(experiment)}
                      disabled={!experiment.unlocked}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Experiment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Experiment */}
            {selectedExperiment && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedExperiment.name}</CardTitle>
                  <CardDescription>Step {experimentStep + 1} of {selectedExperiment.instructions.length}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Current Step:</h4>
                    <p>{selectedExperiment.instructions[experimentStep]}</p>
                  </div>
                  
                  {experimentStep < selectedExperiment.instructions.length - 1 ? (
                    <Button onClick={nextExperimentStep} className="w-full">
                      Next Step
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Expected Observations:</h4>
                        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                          {selectedExperiment.observations.map((observation, index) => (
                            <li key={index}>{observation}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Safety Equipment Required:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {selectedExperiment.safetyEquipment.map((equipment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button onClick={completeExperiment} className="w-full bg-gradient-to-r from-green-500 to-blue-500">
                        <Trophy className="h-4 w-4 mr-2" />
                        Complete Experiment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Experiment History</CardTitle>
                <CardDescription>Your successful reactions and discoveries</CardDescription>
              </CardHeader>
              <CardContent>
                {labState.experimentHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No experiments completed yet.</p>
                    <p className="text-sm">Start combining elements to see your history!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labState.experimentHistory.map((reaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">🧪</div>
                          <div>
                            <h4 className="font-medium">{reaction.name}</h4>
                            <p className="text-sm text-muted-foreground">{reaction.equation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{reaction.xpReward} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
