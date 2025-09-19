"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Calculator, BookOpen, Globe, Palette, Zap, Target } from "lucide-react"

interface Skill {
  id: string
  name: string
  category: string
  level: number
  xp: number
  maxXP: number
  mastery: number // 0-100 percentage
  icon: React.ReactNode
  recentGains: number
  tags: string[]
}

interface SkillTrackerProps {
  skills: Skill[]
  onSkillClick?: (skill: Skill) => void
}

export function SkillTracker({ skills, onSkillClick }: SkillTrackerProps) {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 90) return "text-green-600 bg-green-100"
    if (mastery >= 70) return "text-blue-600 bg-blue-100"
    if (mastery >= 50) return "text-yellow-600 bg-yellow-100"
    return "text-slate-600 bg-slate-100"
  }

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 90) return "Expert"
    if (mastery >= 70) return "Advanced"
    if (mastery >= 50) return "Intermediate"
    return "Beginner"
  }

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-amber-600" />
              {category} Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="cursor-pointer hover:shadow-md transition-all bg-gradient-to-r from-slate-50 to-slate-100"
                  onClick={() => onSkillClick?.(skill)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{skill.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{skill.name}</h4>
                          <Badge variant="outline" className={`text-xs ${getMasteryColor(skill.mastery)}`}>
                            {getMasteryLabel(skill.mastery)}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Level {skill.level}</span>
                            <span>
                              {skill.xp}/{skill.maxXP} XP
                            </span>
                          </div>
                          <Progress value={(skill.xp / skill.maxXP) * 100} className="h-2" />

                          <div className="flex justify-between text-xs">
                            <span>Mastery</span>
                            <span>{skill.mastery}%</span>
                          </div>
                          <Progress value={skill.mastery} className="h-2" />
                        </div>

                        {skill.recentGains > 0 && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              +{skill.recentGains} XP today
                            </Badge>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {skill.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const sampleSkills: Skill[] = [
  {
    id: "math-arithmetic",
    name: "Arithmetic",
    category: "Mathematics",
    level: Math.min(Math.floor(Math.sqrt(750 / 100)) + 1, 100),
    xp: 750,
    maxXP: 1000,
    mastery: 85,
    icon: <Calculator className="h-5 w-5" />,
    recentGains: 45,
    tags: ["Addition", "Subtraction", "Multiplication"],
  },
  {
    id: "math-geometry",
    name: "Geometry",
    category: "Mathematics",
    level: Math.min(Math.floor(Math.sqrt(320 / 100)) + 1, 100),
    xp: 320,
    maxXP: 500,
    mastery: 64,
    icon: <Target className="h-5 w-5" />,
    recentGains: 0,
    tags: ["Shapes", "Area", "Perimeter"],
  },
  {
    id: "science-physics",
    name: "Physics",
    category: "Science",
    level: Math.min(Math.floor(Math.sqrt(480 / 100)) + 1, 100),
    xp: 480,
    maxXP: 600,
    mastery: 72,
    icon: <Zap className="h-5 w-5" />,
    recentGains: 25,
    tags: ["Motion", "Energy", "Forces"],
  },
  {
    id: "language-reading",
    name: "Reading Comprehension",
    category: "Language Arts",
    level: Math.min(Math.floor(Math.sqrt(850 / 100)) + 1, 100),
    xp: 850,
    maxXP: 900,
    mastery: 91,
    icon: <BookOpen className="h-5 w-5" />,
    recentGains: 30,
    tags: ["Comprehension", "Vocabulary", "Analysis"],
  },
  {
    id: "social-geography",
    name: "Geography",
    category: "Social Studies",
    level: Math.min(Math.floor(Math.sqrt(180 / 100)) + 1, 100),
    xp: 180,
    maxXP: 400,
    mastery: 45,
    icon: <Globe className="h-5 w-5" />,
    recentGains: 15,
    tags: ["Maps", "Countries", "Capitals"],
  },
  {
    id: "arts-drawing",
    name: "Drawing",
    category: "Arts",
    level: Math.min(Math.floor(Math.sqrt(120 / 100)) + 1, 100),
    xp: 120,
    maxXP: 300,
    mastery: 40,
    icon: <Palette className="h-5 w-5" />,
    recentGains: 0,
    tags: ["Sketching", "Shading", "Perspective"],
  },
]
