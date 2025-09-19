// SDG Impact Measurement Service with Real-World Project Tracking
import { offlineStorageService } from './offline-storage-service';

export interface SDGGoal {
  id: number;
  title: string;
  description: string;
  targets: SDGTarget[];
  color: string;
  icon: string;
  progress: number;
  studentContributions: number;
  globalRelevance: 'high' | 'medium' | 'low';
}

export interface SDGTarget {
  id: string;
  sdgId: number;
  number: string;
  description: string;
  indicator: string;
  measurableActions: string[];
  studentProjects: string[];
}

export interface StudentImpactContribution {
  id: string;
  studentId: string;
  sdgGoals: number[];
  projectTitle: string;
  description: string;
  impactType: 'direct' | 'indirect' | 'awareness' | 'innovation';
  scope: 'local' | 'regional' | 'national' | 'global';
  metrics: {
    peopleImpacted: number;
    resourcesSaved: number;
    awarenessRaised: number;
    innovationLevel: number;
  };
  evidence: {
    photos: string[];
    videos: string[];
    documents: string[];
    testimonials: string[];
  };
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    verifiedBy: string;
    verificationDate?: Date;
    verificationNotes: string;
  };
  culturalContext: {
    region: string;
    culturalRelevance: string;
    traditionalKnowledge: boolean;
  };
  createdAt: Date;
  xpAwarded: number;
  badgesEarned: string[];
}

export interface RealWorldProject {
  id: string;
  title: string;
  description: string;
  sdgGoals: number[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in days
  participantLimit: number;
  currentParticipants: string[];
  mentor: {
    id: string;
    name: string;
    expertise: string[];
    organization: string;
  };
  location: {
    type: 'local' | 'remote' | 'hybrid';
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
  requirements: string[];
  expectedOutcomes: string[];
  impactMetrics: string[];
  resources: {
    budget?: number;
    materials: string[];
    tools: string[];
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: { date: Date; description: string; completed: boolean }[];
  };
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  culturalIntegration: boolean;
}

export interface ImpactAnalytics {
  totalContributions: number;
  totalStudentsImpacted: number;
  sdgProgress: Record<number, number>;
  geographicDistribution: Record<string, number>;
  impactTrends: {
    date: Date;
    contributions: number;
    studentsActive: number;
    averageImpact: number;
  }[];
  topPerformers: {
    studentId: string;
    contributions: number;
    totalImpact: number;
    sdgsFocused: number[];
  }[];
  communityImpact: {
    totalPeopleImpacted: number;
    resourcesSaved: number;
    awarenessRaised: number;
    projectsCompleted: number;
  };
}

class SDGImpactService {
  private sdgGoals: SDGGoal[] = [
    {
      id: 1,
      title: "No Poverty",
      description: "End poverty in all its forms everywhere",
      targets: [],
      color: "#e5243b",
      icon: "🎯",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 2,
      title: "Zero Hunger",
      description: "End hunger, achieve food security and improved nutrition",
      targets: [],
      color: "#dda63a",
      icon: "🌾",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 3,
      title: "Good Health and Well-being",
      description: "Ensure healthy lives and promote well-being for all",
      targets: [],
      color: "#4c9f38",
      icon: "🏥",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 4,
      title: "Quality Education",
      description: "Ensure inclusive and equitable quality education",
      targets: [],
      color: "#c5192d",
      icon: "📚",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 5,
      title: "Gender Equality",
      description: "Achieve gender equality and empower all women and girls",
      targets: [],
      color: "#ff3a21",
      icon: "⚖️",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 6,
      title: "Clean Water and Sanitation",
      description: "Ensure availability and sustainable management of water",
      targets: [],
      color: "#26bde2",
      icon: "💧",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 7,
      title: "Affordable and Clean Energy",
      description: "Ensure access to affordable, reliable, sustainable energy",
      targets: [],
      color: "#fcc30b",
      icon: "⚡",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 8,
      title: "Decent Work and Economic Growth",
      description: "Promote sustained, inclusive economic growth",
      targets: [],
      color: "#a21942",
      icon: "💼",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 9,
      title: "Industry, Innovation and Infrastructure",
      description: "Build resilient infrastructure, promote innovation",
      targets: [],
      color: "#fd6925",
      icon: "🏭",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 10,
      title: "Reduced Inequalities",
      description: "Reduce inequality within and among countries",
      targets: [],
      color: "#dd1367",
      icon: "⚖️",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 11,
      title: "Sustainable Cities and Communities",
      description: "Make cities and human settlements inclusive and sustainable",
      targets: [],
      color: "#fd9d24",
      icon: "🏙️",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 12,
      title: "Responsible Consumption and Production",
      description: "Ensure sustainable consumption and production patterns",
      targets: [],
      color: "#bf8b2e",
      icon: "♻️",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 13,
      title: "Climate Action",
      description: "Take urgent action to combat climate change",
      targets: [],
      color: "#3f7e44",
      icon: "🌍",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 14,
      title: "Life Below Water",
      description: "Conserve and sustainably use oceans, seas and marine resources",
      targets: [],
      color: "#0a97d9",
      icon: "🌊",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'medium'
    },
    {
      id: 15,
      title: "Life on Land",
      description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
      targets: [],
      color: "#56c02b",
      icon: "🌲",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 16,
      title: "Peace, Justice and Strong Institutions",
      description: "Promote peaceful and inclusive societies for sustainable development",
      targets: [],
      color: "#00689d",
      icon: "⚖️",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    },
    {
      id: 17,
      title: "Partnerships for the Goals",
      description: "Strengthen the means of implementation and revitalize global partnership",
      targets: [],
      color: "#19486a",
      icon: "🤝",
      progress: 0,
      studentContributions: 0,
      globalRelevance: 'high'
    }
  ];

  private contributions: StudentImpactContribution[] = [];
  private realWorldProjects: RealWorldProject[] = [];

  async initialize(): Promise<void> {
    await offlineStorageService.initializeDB();
    await this.loadStoredData();
    this.initializeSDGTargets();
  }

  // Get all SDG goals with current progress
  getSDGGoals(): SDGGoal[] {
    return this.sdgGoals.map(goal => ({
      ...goal,
      progress: this.calculateSDGProgress(goal.id),
      studentContributions: this.getSDGContributionCount(goal.id)
    }));
  }

  // Get specific SDG goal
  getSDGGoal(id: number): SDGGoal | null {
    const goal = this.sdgGoals.find(g => g.id === id);
    if (!goal) return null;

    return {
      ...goal,
      progress: this.calculateSDGProgress(id),
      studentContributions: this.getSDGContributionCount(id)
    };
  }

  // Submit a new impact contribution
  async submitImpactContribution(contribution: Omit<StudentImpactContribution, 'id' | 'createdAt' | 'verification'>): Promise<string> {
    const newContribution: StudentImpactContribution = {
      ...contribution,
      id: `impact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      verification: {
        status: 'pending',
        verifiedBy: '',
        verificationNotes: ''
      }
    };

    this.contributions.push(newContribution);
    
    // Store offline
    await offlineStorageService.storeOfflineData(newContribution, 'progress');
    
    // Update SDG progress
    this.updateSDGProgress();
    
    return newContribution.id;
  }

  // Create a real-world project
  async createRealWorldProject(project: Omit<RealWorldProject, 'id' | 'currentParticipants' | 'status'>): Promise<string> {
    const newProject: RealWorldProject = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentParticipants: [],
      status: 'planning'
    };

    this.realWorldProjects.push(newProject);
    
    // Store offline
    await offlineStorageService.storeOfflineData(newProject, 'resource');
    
    return newProject.id;
  }

  // Join a real-world project
  async joinProject(projectId: string, studentId: string): Promise<boolean> {
    const project = this.realWorldProjects.find(p => p.id === projectId);
    if (!project) return false;

    if (project.currentParticipants.length >= project.participantLimit) {
      return false;
    }

    if (!project.currentParticipants.includes(studentId)) {
      project.currentParticipants.push(studentId);
      await offlineStorageService.storeOfflineData(project, 'resource');
    }

    return true;
  }

  // Get available real-world projects
  getRealWorldProjects(filters?: {
    sdgGoals?: number[];
    difficulty?: RealWorldProject['difficulty'];
    location?: string;
    status?: RealWorldProject['status'];
  }): RealWorldProject[] {
    let projects = this.realWorldProjects;

    if (filters) {
      if (filters.sdgGoals) {
        projects = projects.filter(p => 
          p.sdgGoals.some(goal => filters.sdgGoals!.includes(goal))
        );
      }
      if (filters.difficulty) {
        projects = projects.filter(p => p.difficulty === filters.difficulty);
      }
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
    }

    return projects;
  }

  // Get student's contributions
  getStudentContributions(studentId: string): StudentImpactContribution[] {
    return this.contributions.filter(c => c.studentId === studentId);
  }

  // Get student's impact analytics
  getStudentImpactAnalytics(studentId: string): {
    totalContributions: number;
    verifiedContributions: number;
    totalPeopleImpacted: number;
    sdgGoalsContributed: number[];
    averageImpactScore: number;
    culturalProjects: number;
    globalReach: string[];
  } {
    const studentContributions = this.getStudentContributions(studentId);
    
    return {
      totalContributions: studentContributions.length,
      verifiedContributions: studentContributions.filter(c => c.verification.status === 'verified').length,
      totalPeopleImpacted: studentContributions.reduce((sum, c) => sum + c.metrics.peopleImpacted, 0),
      sdgGoalsContributed: [...new Set(studentContributions.flatMap(c => c.sdgGoals))],
      averageImpactScore: this.calculateAverageImpactScore(studentContributions),
      culturalProjects: studentContributions.filter(c => c.culturalContext.traditionalKnowledge).length,
      globalReach: [...new Set(studentContributions.map(c => c.culturalContext.region))]
    };
  }

  // Get community impact analytics
  getCommunityImpactAnalytics(): ImpactAnalytics {
    const verifiedContributions = this.contributions.filter(c => c.verification.status === 'verified');
    
    return {
      totalContributions: verifiedContributions.length,
      totalStudentsImpacted: new Set(verifiedContributions.map(c => c.studentId)).size,
      sdgProgress: this.calculateSDGProgressMap(),
      geographicDistribution: this.calculateGeographicDistribution(verifiedContributions),
      impactTrends: this.calculateImpactTrends(verifiedContributions),
      topPerformers: this.calculateTopPerformers(),
      communityImpact: {
        totalPeopleImpacted: verifiedContributions.reduce((sum, c) => sum + c.metrics.peopleImpacted, 0),
        resourcesSaved: verifiedContributions.reduce((sum, c) => sum + c.metrics.resourcesSaved, 0),
        awarenessRaised: verifiedContributions.reduce((sum, c) => sum + c.metrics.awarenessRaised, 0),
        projectsCompleted: this.realWorldProjects.filter(p => p.status === 'completed').length
      }
    };
  }

  // Verify impact contribution (admin function)
  async verifyContribution(contributionId: string, verifiedBy: string, notes: string, approved: boolean): Promise<void> {
    const contribution = this.contributions.find(c => c.id === contributionId);
    if (!contribution) return;

    contribution.verification = {
      status: approved ? 'verified' : 'rejected',
      verifiedBy,
      verificationDate: new Date(),
      verificationNotes: notes
    };

    if (approved) {
      // Award XP and badges for verified contribution
      contribution.xpAwarded = this.calculateImpactXP(contribution);
      contribution.badgesEarned = this.calculateImpactBadges(contribution);
    }

    await offlineStorageService.storeOfflineData(contribution, 'progress');
  }

  // Generate impact recommendations for students
  generateImpactRecommendations(studentId: string, interests: string[], location: string): {
    sdgGoals: SDGGoal[];
    projects: RealWorldProject[];
    actions: string[];
  } {
    const studentHistory = this.getStudentContributions(studentId);
    const previousSDGs = studentHistory.flatMap(c => c.sdgGoals);
    
    // Recommend SDGs based on interests and location
    const recommendedSDGs = this.sdgGoals.filter(goal => {
      const notOverfocused = this.getSDGContributionCount(goal.id) < 5;
      const relevantToLocation = this.isSDGRelevantToLocation(goal.id, location);
      const matchesInterests = this.doesSDGMatchInterests(goal.id, interests);
      
      return notOverfocused && (relevantToLocation || matchesInterests);
    }).slice(0, 5);

    // Recommend projects
    const recommendedProjects = this.getRealWorldProjects({
      sdgGoals: recommendedSDGs.map(g => g.id),
      status: 'planning'
    }).slice(0, 3);

    // Generate action recommendations
    const actions = this.generateActionRecommendations(recommendedSDGs, location);

    return {
      sdgGoals: recommendedSDGs,
      projects: recommendedProjects,
      actions
    };
  }

  // Private helper methods

  private calculateSDGProgress(sdgId: number): number {
    const contributions = this.contributions.filter(c => 
      c.sdgGoals.includes(sdgId) && c.verification.status === 'verified'
    );
    
    if (contributions.length === 0) return 0;
    
    const totalImpact = contributions.reduce((sum, c) => {
      return sum + (c.metrics.peopleImpacted * 0.4) + 
                  (c.metrics.resourcesSaved * 0.3) +
                  (c.metrics.awarenessRaised * 0.2) +
                  (c.metrics.innovationLevel * 0.1);
    }, 0);
    
    // Convert to percentage (arbitrary scale for demo)
    return Math.min(100, Math.round(totalImpact / 100));
  }

  private getSDGContributionCount(sdgId: number): number {
    return this.contributions.filter(c => c.sdgGoals.includes(sdgId)).length;
  }

  private updateSDGProgress(): void {
    this.sdgGoals.forEach(goal => {
      goal.progress = this.calculateSDGProgress(goal.id);
      goal.studentContributions = this.getSDGContributionCount(goal.id);
    });
  }

  private calculateSDGProgressMap(): Record<number, number> {
    const progressMap: Record<number, number> = {};
    this.sdgGoals.forEach(goal => {
      progressMap[goal.id] = this.calculateSDGProgress(goal.id);
    });
    return progressMap;
  }

  private calculateGeographicDistribution(contributions: StudentImpactContribution[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    contributions.forEach(contribution => {
      const region = contribution.culturalContext.region;
      distribution[region] = (distribution[region] || 0) + 1;
    });
    return distribution;
  }

  private calculateImpactTrends(contributions: StudentImpactContribution[]): ImpactAnalytics['impactTrends'] {
    const trends: Record<string, { contributions: number; students: Set<string>; totalImpact: number }> = {};
    
    contributions.forEach(contribution => {
      const monthKey = contribution.createdAt.toISOString().substring(0, 7);
      if (!trends[monthKey]) {
        trends[monthKey] = { contributions: 0, students: new Set(), totalImpact: 0 };
      }
      
      trends[monthKey].contributions++;
      trends[monthKey].students.add(contribution.studentId);
      trends[monthKey].totalImpact += this.calculateContributionImpactScore(contribution);
    });

    return Object.entries(trends).map(([monthKey, data]) => ({
      date: new Date(monthKey + '-01'),
      contributions: data.contributions,
      studentsActive: data.students.size,
      averageImpact: data.totalImpact / data.contributions || 0
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private calculateTopPerformers(): ImpactAnalytics['topPerformers'] {
    const studentStats: Record<string, {
      contributions: number;
      totalImpact: number;
      sdgsFocused: Set<number>;
    }> = {};

    this.contributions
      .filter(c => c.verification.status === 'verified')
      .forEach(contribution => {
        if (!studentStats[contribution.studentId]) {
          studentStats[contribution.studentId] = {
            contributions: 0,
            totalImpact: 0,
            sdgsFocused: new Set()
          };
        }

        const stats = studentStats[contribution.studentId];
        stats.contributions++;
        stats.totalImpact += this.calculateContributionImpactScore(contribution);
        contribution.sdgGoals.forEach(sdg => stats.sdgsFocused.add(sdg));
      });

    return Object.entries(studentStats)
      .map(([studentId, stats]) => ({
        studentId,
        contributions: stats.contributions,
        totalImpact: stats.totalImpact,
        sdgsFocused: Array.from(stats.sdgsFocused)
      }))
      .sort((a, b) => b.totalImpact - a.totalImpact)
      .slice(0, 10);
  }

  private calculateAverageImpactScore(contributions: StudentImpactContribution[]): number {
    if (contributions.length === 0) return 0;
    
    const totalScore = contributions.reduce((sum, c) => sum + this.calculateContributionImpactScore(c), 0);
    return Math.round(totalScore / contributions.length);
  }

  private calculateContributionImpactScore(contribution: StudentImpactContribution): number {
    const metrics = contribution.metrics;
    return (metrics.peopleImpacted * 0.4) +
           (metrics.resourcesSaved * 0.3) +
           (metrics.awarenessRaised * 0.2) +
           (metrics.innovationLevel * 0.1);
  }

  private calculateImpactXP(contribution: StudentImpactContribution): number {
    const baseXP = 100;
    const impactScore = this.calculateContributionImpactScore(contribution);
    const scopeMultiplier = {
      'local': 1,
      'regional': 1.5,
      'national': 2,
      'global': 3
    }[contribution.scope];

    return Math.round(baseXP + (impactScore * scopeMultiplier));
  }

  private calculateImpactBadges(contribution: StudentImpactContribution): string[] {
    const badges: string[] = [];
    
    if (contribution.metrics.peopleImpacted > 100) badges.push('Community Champion');
    if (contribution.metrics.innovationLevel > 7) badges.push('Innovation Leader');
    if (contribution.culturalContext.traditionalKnowledge) badges.push('Cultural Preservationist');
    if (contribution.scope === 'global') badges.push('Global Impact Maker');
    
    return badges;
  }

  private isSDGRelevantToLocation(sdgId: number, location: string): boolean {
    // Simplified location-based relevance logic
    const locationRelevance: Record<string, number[]> = {
      'rural': [1, 2, 6, 7, 15],
      'urban': [11, 9, 3, 13],
      'coastal': [14, 13, 11],
      'developing': [1, 2, 3, 4, 6],
      'developed': [12, 13, 16, 17]
    };

    return locationRelevance[location.toLowerCase()]?.includes(sdgId) || false;
  }

  private doesSDGMatchInterests(sdgId: number, interests: string[]): boolean {
    const interestMapping: Record<string, number[]> = {
      'environment': [13, 14, 15],
      'technology': [9, 4, 8],
      'health': [3, 2, 6],
      'education': [4, 5, 10],
      'arts': [11, 16, 17],
      'science': [9, 13, 14, 15]
    };

    return interests.some(interest => 
      interestMapping[interest.toLowerCase()]?.includes(sdgId)
    );
  }

  private generateActionRecommendations(sdgGoals: SDGGoal[], location: string): string[] {
    const actions: string[] = [];
    
    sdgGoals.forEach(goal => {
      switch (goal.id) {
        case 4: // Quality Education
          actions.push(`Create educational content in your local language`);
          actions.push(`Mentor younger students in your community`);
          break;
        case 13: // Climate Action
          actions.push(`Organize a community tree planting event`);
          actions.push(`Start a recycling program at school`);
          break;
        case 1: // No Poverty
          actions.push(`Organize a skill-sharing workshop for job skills`);
          actions.push(`Create awareness about government assistance programs`);
          break;
        default:
          actions.push(`Research local challenges related to ${goal.title}`);
      }
    });

    return actions.slice(0, 5);
  }

  private initializeSDGTargets(): void {
    // Initialize with some sample targets - in production, this would be comprehensive
    this.sdgGoals.forEach(goal => {
      goal.targets = [
        {
          id: `${goal.id}.1`,
          sdgId: goal.id,
          number: `${goal.id}.1`,
          description: `Primary target for ${goal.title}`,
          indicator: `Progress indicator for ${goal.title}`,
          measurableActions: ['Action 1', 'Action 2', 'Action 3'],
          studentProjects: []
        }
      ];
    });
  }

  private async loadStoredData(): Promise<void> {
    try {
      // In a real application, load from database
      // For now, we'll start with empty arrays
      this.contributions = [];
      this.realWorldProjects = [];
    } catch (error) {
      console.error('Failed to load stored SDG data:', error);
    }
  }
}

export const sdgImpactService = new SDGImpactService();