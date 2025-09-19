"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Star, Palette, Trophy, Zap, Crown, Sparkles } from "lucide-react"

interface RewardItem {
  id: string
  name: string
  description: string
  cost: number
  category: "avatars" | "themes" | "badges" | "vouchers"
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: React.ReactNode
  owned: boolean
  limited?: boolean
  discount?: number
}

interface RewardStoreProps {
  userXP: number
  ownedItems: string[]
  onPurchase: (item: RewardItem) => void
}

export function RewardStore({ userXP, ownedItems, onPurchase }: RewardStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("avatars")

  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-amber-300 bg-amber-50",
  }

  const rewards: RewardItem[] = [
    // Avatars
    {
      id: "avatar-scientist",
      name: "Scientist Avatar",
      description: "Unlock the cool scientist look",
      cost: 500,
      category: "avatars",
      rarity: "common",
      icon: <Sparkles className="h-5 w-5" />,
      owned: ownedItems.includes("avatar-scientist"),
    },
    {
      id: "avatar-explorer",
      name: "Explorer Avatar",
      description: "Adventure-ready explorer outfit",
      cost: 1200,
      category: "avatars",
      rarity: "rare",
      icon: <Crown className="h-5 w-5" />,
      owned: ownedItems.includes("avatar-explorer"),
    },
    // Themes
    {
      id: "theme-ocean",
      name: "Ocean Theme",
      description: "Calming blue ocean theme",
      cost: 800,
      category: "themes",
      rarity: "common",
      icon: <Palette className="h-5 w-5" />,
      owned: ownedItems.includes("theme-ocean"),
    },
    {
      id: "theme-space",
      name: "Space Theme",
      description: "Cosmic space adventure theme",
      cost: 1500,
      category: "themes",
      rarity: "epic",
      icon: <Star className="h-5 w-5" />,
      owned: ownedItems.includes("theme-space"),
      limited: true,
    },
    // Badges
    {
      id: "badge-golden-star",
      name: "Golden Star",
      description: "Exclusive golden star badge",
      cost: 2000,
      category: "badges",
      rarity: "legendary",
      icon: <Trophy className="h-5 w-5" />,
      owned: ownedItems.includes("badge-golden-star"),
    },
    // Vouchers
    {
      id: "voucher-extra-time",
      name: "Extra Time Voucher",
      description: "+30 seconds on timed quizzes",
      cost: 300,
      category: "vouchers",
      rarity: "common",
      icon: <Zap className="h-5 w-5" />,
      owned: ownedItems.includes("voucher-extra-time"),
      discount: 20,
    },
  ]

  const filteredRewards = rewards.filter((reward) => reward.category === selectedCategory)

  const canAfford = (cost: number) => userXP >= cost

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-600" />
          Reward Store
        </CardTitle>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium">Your XP: {userXP.toLocaleString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRewards.map((item) => (
                <Card key={item.id} className={`${rarityColors[item.rarity]} transition-all hover:shadow-md`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.limited && (
                            <Badge variant="destructive" className="text-xs">
                              Limited
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-600" />
                            <span
                              className={`text-sm font-medium ${item.discount ? "line-through text-slate-400" : "text-amber-800"}`}
                            >
                              {item.cost}
                            </span>
                            {item.discount && (
                              <span className="text-sm font-medium text-green-600">
                                {Math.floor(item.cost * (1 - item.discount / 100))}
                              </span>
                            )}
                          </div>

                          {item.owned ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Owned
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              disabled={
                                !canAfford(
                                  item.discount ? Math.floor(item.cost * (1 - item.discount / 100)) : item.cost,
                                )
                              }
                              onClick={() => onPurchase(item)}
                              className="text-xs"
                            >
                              {canAfford(item.discount ? Math.floor(item.cost * (1 - item.discount / 100)) : item.cost)
                                ? "Buy"
                                : "Need More XP"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
