/**
 * Next-Generation XP System with Achievement Badges and Multi-Level Leaderboards
 * Supports cultural elements, blockchain credentials, and global connectivity
 */

// Simple hash function for blockchain credentials
function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export interface CulturalElement {
  id: string;
  name: string;
  origin: string;
  category: 'traditional_art' | 'folklore' | 'language' | 'craft' | 'music' | 'dance' | 'cuisine';
  description: string;
  visualAssets: string[];
  culturalSignificance: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'cultural' | 'collaboration' | 'leadership' | 'innovation' | 'community_impact';
  requirements: {
    type: 'xp_threshold' | 'consecutive_days' | 'skill_mastery' | 'cultural_preservation' | 'peer_teaching' | 'sdg_contribution';
    value: number;
    metadata?: Record<string, any>;
  }[];
  rewards: {
    xp: number;
    culturalElements: string[]; // IDs of unlocked cultural elements
    badges: string[];
    blockchainCredential?: BlockchainCredential;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  culturalContext?: {
    region: string;
    tradition: string;
    significance: string;
  };
  unlockedAt?: Date;
}

export interface BlockchainCredential {
  id: string;
  hash: string;
  timestamp: Date;
  issuer: string;
  verificationUrl: string;
  metadata: {
    achievement: string;
    student: string;
    grade: string;
    school: string;
    culturalContext?: string;
  };
}

export interface StudentAvatar {
  id: string;
  baseModel: string;
  culturalElements: {
    clothing: CulturalElement[];
    accessories: CulturalElement[];
    backgroundTheme: CulturalElement;
  };
  animations: string[];
  level: number;
  prestigeLevel: number;
}

export interface XPSource {
  activity: string;
  baseXP: number;
  multipliers: {
    culturalBonus: number;
    collaborationBonus: number;
    innovationBonus: number;
    difficultyMultiplier: number;
  };
  metadata?: Record<string, any>;
}

export interface LeaderboardLevel {
  id: string;
  name: string;
  scope: 'classroom' | 'school' | 'district' | 'state' | 'national' | 'global';
  participants: LeaderboardEntry[];
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  culturalCategory?: string;
}

export interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  avatar: StudentAvatar;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  culturalContributions: number;
  globalCollaborations: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
  country: string;
  region: string;
}

export interface SkillMastery {
  skillId: string;
  skillName: string;
  level: number;
  xp: number;
  maxLevel: number;
  culturalIntegration: {
    traditionalKnowledge: boolean;
    modernApplication: boolean;
    crossCulturalUnderstanding: boolean;
  };
  realWorldProjects: string[];
}

export interface SDGContribution {
  sdgGoal: number;
  description: string;
  impact: 'local' | 'regional' | 'national' | 'global';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  xpAwarded: number;
  culturalRelevance: string;
}

export class NextGenXPSystem {
  private static readonly XP_LEVELS = [
    0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200, 5950, 6750,
    7600, 8500, 9450, 10450, 11500, 12600, 13750, 14950, 16200, 17500, 18850, 20250, 21700, 23200
  ];

  private static readonly CULTURAL_MULTIPLIERS = {
    traditional_art: 1.2,
    folklore: 1.15,
    language: 1.3,
    craft: 1.1,
    music: 1.25,
    dance: 1.2,
    cuisine: 1.1
  };

  /**
   * Calculate level from total XP
   */
  static calculateLevel(totalXP: number): number {
    for (let i = this.XP_LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= this.XP_LEVELS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Calculate XP needed for next level
   */
  static getXPToNextLevel(totalXP: number): number {
    const currentLevel = this.calculateLevel(totalXP);
    if (currentLevel >= this.XP_LEVELS.length) return 0;
    
    return this.XP_LEVELS[currentLevel] - totalXP;
  }

  /**
   * Award XP with cultural and collaboration bonuses
   */
  static calculateXPReward(source: XPSource, culturalContext?: CulturalElement[]): number {
    let totalXP = source.baseXP;

    // Apply multipliers
    totalXP *= source.multipliers.difficultyMultiplier;
    totalXP *= (1 + source.multipliers.collaborationBonus);
    totalXP *= (1 + source.multipliers.innovationBonus);

    // Cultural bonus
    if (culturalContext && culturalContext.length > 0) {
      const culturalBonus = culturalContext.reduce((bonus, element) => {
        return bonus + (this.CULTURAL_MULTIPLIERS[element.category] || 1);
      }, 0) / culturalContext.length;
      
      totalXP *= culturalBonus;
    }

    return Math.round(totalXP);
  }

  /**
   * Generate blockchain credential for achievement
   */
  static async generateBlockchainCredential(
    achievement: Achievement,
    studentId: string,
    additionalData: Record<string, any>
  ): Promise<BlockchainCredential> {
    const timestamp = new Date();
    const dataToHash = JSON.stringify({
      achievement: achievement.id,
      student: studentId,
      timestamp: timestamp.toISOString(),
      ...additionalData
    });

    const hash = simpleHash(dataToHash);

    return {
      id: `cred_${achievement.id}_${studentId}_${Date.now()}`,
      hash,
      timestamp,
      issuer: 'EduNova_Global_Platform',
      verificationUrl: `https://blockchain.edunova.edu/verify/${hash}`,
      metadata: {
        achievement: achievement.id,
        student: studentId,
        grade: additionalData.grade || 'Unknown',
        school: additionalData.school || 'Unknown',
        culturalContext: additionalData.culturalContext
      }
    };
  }

  /**
   * Check if student qualifies for achievements
   */
  static checkAchievements(
    studentData: {
      totalXP: number;
      consecutiveDays: number;
      skillMasteries: SkillMastery[];
      culturalContributions: number;
      peerTeachingSessions: number;
      sdgContributions: SDGContribution[];
    },
    availableAchievements: Achievement[]
  ): Achievement[] {
    return availableAchievements.filter(achievement => {
      return achievement.requirements.every(req => {
        switch (req.type) {
          case 'xp_threshold':
            return studentData.totalXP >= req.value;
          
          case 'consecutive_days':
            return studentData.consecutiveDays >= req.value;
          
          case 'skill_mastery':
            return studentData.skillMasteries.filter(skill => skill.level >= req.value).length > 0;
          
          case 'cultural_preservation':
            return studentData.culturalContributions >= req.value;
          
          case 'peer_teaching':
            return studentData.peerTeachingSessions >= req.value;
          
          case 'sdg_contribution':
            return studentData.sdgContributions.filter(sdg => sdg.verificationStatus === 'verified').length >= req.value;
          
          default:
            return false;
        }
      });
    });
  }

  /**
   * Generate leaderboard for specific scope and timeframe
   */
  static generateLeaderboard(
    entries: LeaderboardEntry[],
    scope: LeaderboardLevel['scope'],
    timeframe: LeaderboardLevel['timeframe'],
    culturalCategory?: string
  ): LeaderboardLevel {
    let filteredEntries = [...entries];

    // Filter by cultural category if specified
    if (culturalCategory) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.culturalContributions > 0
      );
    }

    // Sort by total XP
    filteredEntries.sort((a, b) => b.totalXP - a.totalXP);

    // Assign positions and trends
    filteredEntries.forEach((entry, index) => {
      entry.position = index + 1;
      // Trend calculation would be based on historical data
      entry.trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
    });

    return {
      id: `leaderboard_${scope}_${timeframe}_${Date.now()}`,
      name: `${scope.charAt(0).toUpperCase() + scope.slice(1)} ${timeframe} Leaderboard`,
      scope,
      participants: filteredEntries,
      timeframe,
      culturalCategory
    };
  }

  /**
   * Create cultural avatar customization
   */
  static createCulturalAvatar(
    baseModel: string,
    unlockedCulturalElements: CulturalElement[],
    level: number
  ): StudentAvatar {
    const clothing = unlockedCulturalElements.filter(el => el.category === 'traditional_art');
    const accessories = unlockedCulturalElements.filter(el => el.category === 'craft');
    const backgroundTheme = unlockedCulturalElements.find(el => el.category === 'traditional_art') || {
      id: 'default',
      name: 'Global Unity',
      origin: 'Universal',
      category: 'traditional_art' as const,
      description: 'Celebrating global unity through education',
      visualAssets: ['/avatars/themes/global-unity.png'],
      culturalSignificance: 'Represents the interconnected nature of human knowledge'
    };

    return {
      id: `avatar_${Date.now()}`,
      baseModel,
      culturalElements: {
        clothing,
        accessories,
        backgroundTheme
      },
      animations: this.getAvailableAnimations(level),
      level,
      prestigeLevel: Math.floor(level / 30)
    };
  }

  private static getAvailableAnimations(level: number): string[] {
    const baseAnimations = ['idle', 'wave', 'celebrate'];
    
    if (level >= 5) baseAnimations.push('dance_traditional');
    if (level >= 10) baseAnimations.push('meditation');
    if (level >= 15) baseAnimations.push('teaching_gesture');
    if (level >= 20) baseAnimations.push('cultural_performance');
    if (level >= 25) baseAnimations.push('global_connection');
    
    return baseAnimations;
  }

  /**
   * Calculate global impact score
   */
  static calculateGlobalImpactScore(
    culturalContributions: number,
    globalCollaborations: number,
    sdgContributions: SDGContribution[],
    peerTeachingSessions: number
  ): number {
    const verifiedSDGs = sdgContributions.filter(sdg => sdg.verificationStatus === 'verified');
    const globalSDGs = verifiedSDGs.filter(sdg => sdg.impact === 'global').length;
    const nationalSDGs = verifiedSDGs.filter(sdg => sdg.impact === 'national').length;
    const regionalSDGs = verifiedSDGs.filter(sdg => sdg.impact === 'regional').length;
    const localSDGs = verifiedSDGs.filter(sdg => sdg.impact === 'local').length;

    return (
      culturalContributions * 10 +
      globalCollaborations * 15 +
      globalSDGs * 50 +
      nationalSDGs * 30 +
      regionalSDGs * 20 +
      localSDGs * 10 +
      peerTeachingSessions * 5
    );
  }

  /**
   * Generate achievement recommendations based on student progress
   */
  static generateAchievementRecommendations(
    studentData: any,
    availableAchievements: Achievement[]
  ): Achievement[] {
    return availableAchievements
      .filter(achievement => !achievement.unlockedAt)
      .map(achievement => {
        const completedRequirements = achievement.requirements.filter(req => {
          // Same logic as checkAchievements but for individual requirements
          return this.evaluateRequirement(req, studentData);
        }).length;

        return {
          ...achievement,
          progress: completedRequirements / achievement.requirements.length
        };
      })
      .sort((a: any, b: any) => b.progress - a.progress)
      .slice(0, 5);
  }

  private static evaluateRequirement(req: Achievement['requirements'][0], studentData: any): boolean {
    switch (req.type) {
      case 'xp_threshold':
        return studentData.totalXP >= req.value;
      case 'consecutive_days':
        return studentData.consecutiveDays >= req.value;
      case 'skill_mastery':
        return studentData.skillMasteries.filter((skill: SkillMastery) => skill.level >= req.value).length > 0;
      case 'cultural_preservation':
        return studentData.culturalContributions >= req.value;
      case 'peer_teaching':
        return studentData.peerTeachingSessions >= req.value;
      case 'sdg_contribution':
        return studentData.sdgContributions.filter((sdg: SDGContribution) => sdg.verificationStatus === 'verified').length >= req.value;
      default:
        return false;
    }
  }
}

/**
 * Default achievements with cultural and global focus
 */
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'cultural_explorer',
    name: 'Cultural Explorer',
    description: 'Discover and learn about 5 different cultural traditions',
    category: 'cultural',
    requirements: [
      { type: 'cultural_preservation', value: 5 }
    ],
    rewards: {
      xp: 500,
      culturalElements: ['traditional_clothing_set_1'],
      badges: ['explorer_badge'],
    },
    rarity: 'common',
    icon: '🌍',
    culturalContext: {
      region: 'Global',
      tradition: 'Cultural Appreciation',
      significance: 'Promotes understanding of diverse cultural heritage'
    }
  },
  {
    id: 'global_collaborator',
    name: 'Global Collaborator',
    description: 'Successfully collaborate with students from 3 different countries',
    category: 'collaboration',
    requirements: [
      { type: 'peer_teaching', value: 10 }
    ],
    rewards: {
      xp: 750,
      culturalElements: ['global_unity_badge'],
      badges: ['collaboration_master'],
    },
    rarity: 'uncommon',
    icon: '🤝',
    culturalContext: {
      region: 'International',
      tradition: 'Global Citizenship',
      significance: 'Builds bridges across cultures through education'
    }
  },
  {
    id: 'sdg_champion',
    name: 'SDG Champion',
    description: 'Contribute to 3 different Sustainable Development Goals',
    category: 'community_impact',
    requirements: [
      { type: 'sdg_contribution', value: 3 }
    ],
    rewards: {
      xp: 1000,
      culturalElements: ['sdg_champion_badge'],
      badges: ['change_maker'],
    },
    rarity: 'rare',
    icon: '🎯',
    culturalContext: {
      region: 'Global',
      tradition: 'Social Responsibility',
      significance: 'Demonstrates commitment to global positive change'
    }
  }
];

/**
 * Default cultural elements for avatar customization
 */
export const DEFAULT_CULTURAL_ELEMENTS: CulturalElement[] = [
  {
    id: 'indian_traditional_art',
    name: 'Indian Traditional Art',
    origin: 'India',
    category: 'traditional_art',
    description: 'Beautiful patterns inspired by Indian traditional art forms',
    visualAssets: ['/cultural/indian-art-pattern.png'],
    culturalSignificance: 'Represents the rich artistic heritage of India'
  },
  {
    id: 'african_textile',
    name: 'African Textile Patterns',
    origin: 'Various African Regions',
    category: 'traditional_art',
    description: 'Vibrant textile patterns from various African cultures',
    visualAssets: ['/cultural/african-textile.png'],
    culturalSignificance: 'Celebrates the diverse textile traditions of Africa'
  },
  {
    id: 'indigenous_craft',
    name: 'Indigenous Craft Elements',
    origin: 'Global Indigenous Communities',
    category: 'craft',
    description: 'Handcrafted elements representing indigenous knowledge',
    visualAssets: ['/cultural/indigenous-craft.png'],
    culturalSignificance: 'Honors the wisdom and skills of indigenous communities'
  }
];