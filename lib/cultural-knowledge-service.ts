// Cultural Knowledge Preservation and Global Collaboration Service
import { offlineStorageService } from './offline-storage-service';

export interface CulturalArtifact {
  id: string;
  title: string;
  description: string;
  category: 'story' | 'song' | 'dance' | 'craft' | 'recipe' | 'tradition' | 'language' | 'art';
  culturalOrigin: {
    region: string;
    community: string;
    language: string;
    timeperiod: string;
  };
  content: {
    text?: string;
    audio?: string[];
    video?: string[];
    images?: string[];
    documents?: string[];
  };
  metadata: {
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    ageGroup: string;
    significance: string;
    preservation_urgency: 'low' | 'medium' | 'high' | 'critical';
  };
  contributors: {
    id: string;
    name: string;
    role: 'creator' | 'curator' | 'translator' | 'validator';
    culturalBackground: string;
  }[];
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    verifiedBy: string;
    culturalAuthority: boolean;
    verificationDate?: Date;
    notes: string;
  };
  translations: Record<string, {
    text: string;
    audio?: string;
    translator: string;
    verified: boolean;
  }>;
  interactions: {
    views: number;
    shares: number;
    likes: number;
    comments: Comment[];
    learningActivities: string[];
  };
  educationalIntegration: {
    subjects: string[];
    gradeLevel: string[];
    learningObjectives: string[];
    activities: LearningActivity[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningActivity {
  id: string;
  title: string;
  type: 'quiz' | 'creative' | 'research' | 'presentation' | 'storytelling' | 'hands_on';
  instructions: string;
  materials: string[];
  duration: number; // in minutes
  assessment: {
    criteria: string[];
    rubric: string;
  };
  culturalLearningOutcomes: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  culturalInsight?: string;
  timestamp: Date;
  replies: Comment[];
}

export interface GlobalCollaborationProject {
  id: string;
  title: string;
  description: string;
  theme: string;
  collaborationType: 'cultural_exchange' | 'joint_research' | 'art_creation' | 'story_sharing' | 'tradition_comparison';
  participatingSchools: {
    schoolId: string;
    schoolName: string;
    location: string;
    culturalContext: string;
    students: string[];
    teacher: string;
  }[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: {
      date: Date;
      description: string;
      deliverable: string;
      completed: boolean;
    }[];
  };
  sharedArtifacts: string[]; // CulturalArtifact IDs
  collaborationActivities: {
    id: string;
    type: 'video_call' | 'shared_document' | 'art_exchange' | 'story_swap' | 'virtual_tour';
    scheduledDate: Date;
    participants: string[];
    completed: boolean;
    outcomes: string[];
  }[];
  outputs: {
    id: string;
    title: string;
    type: 'presentation' | 'artwork' | 'documentary' | 'exhibition' | 'report';
    contributors: string[];
    content: string;
    culturalBlend: string[];
  }[];
  status: 'planning' | 'active' | 'completed' | 'archived';
  impact: {
    studentsInvolved: number;
    culturesRepresented: number;
    artifactsCreated: number;
    crossCulturalUnderstanding: number; // score out of 10
  };
}

export interface CulturalExchangeSession {
  id: string;
  title: string;
  description: string;
  hostSchool: string;
  participatingSchools: string[];
  culturalFocus: string;
  sessionType: 'live_performance' | 'cooking_demo' | 'language_lesson' | 'craft_workshop' | 'storytelling';
  scheduledTime: Date;
  duration: number; // in minutes
  presenter: {
    id: string;
    name: string;
    expertise: string;
    culturalBackground: string;
  };
  interactiveElements: {
    polls: boolean;
    qna: boolean;
    breakoutRooms: boolean;
    sharedActivities: boolean;
  };
  recordings: {
    available: boolean;
    url?: string;
    transcripts?: Record<string, string>; // language -> transcript
  };
  feedback: {
    rating: number;
    comments: string[];
    culturalLearningValue: number;
    engagementLevel: number;
  };
}

class CulturalKnowledgeService {
  private artifacts: CulturalArtifact[] = [];
  private collaborationProjects: GlobalCollaborationProject[] = [];
  private exchangeSessions: CulturalExchangeSession[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await offlineStorageService.initializeDB();
    await this.loadStoredData();
    await this.seedInitialArtifacts();
    
    this.isInitialized = true;
  }

  // Cultural Artifact Management
  async submitCulturalArtifact(artifact: Omit<CulturalArtifact, 'id' | 'createdAt' | 'updatedAt' | 'interactions' | 'verification'>): Promise<string> {
    const newArtifact: CulturalArtifact = {
      ...artifact,
      id: `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      interactions: {
        views: 0,
        shares: 0,
        likes: 0,
        comments: [],
        learningActivities: []
      },
      verification: {
        status: 'pending',
        verifiedBy: '',
        culturalAuthority: false,
        notes: ''
      }
    };

    this.artifacts.push(newArtifact);
    await offlineStorageService.storeOfflineData(newArtifact, 'cultural');
    
    return newArtifact.id;
  }

  getCulturalArtifacts(filters?: {
    category?: CulturalArtifact['category'];
    region?: string;
    language?: string;
    urgency?: CulturalArtifact['metadata']['preservation_urgency'];
    verified?: boolean;
  }): CulturalArtifact[] {
    let filteredArtifacts = this.artifacts;

    if (filters) {
      if (filters.category) {
        filteredArtifacts = filteredArtifacts.filter(a => a.category === filters.category);
      }
      if (filters.region) {
        filteredArtifacts = filteredArtifacts.filter(a => 
          a.culturalOrigin.region.toLowerCase().includes(filters.region!.toLowerCase())
        );
      }
      if (filters.language) {
        filteredArtifacts = filteredArtifacts.filter(a => 
          a.culturalOrigin.language.toLowerCase().includes(filters.language!.toLowerCase())
        );
      }
      if (filters.urgency) {
        filteredArtifacts = filteredArtifacts.filter(a => a.metadata.preservation_urgency === filters.urgency);
      }
      if (filters.verified !== undefined) {
        filteredArtifacts = filteredArtifacts.filter(a => 
          (a.verification.status === 'verified') === filters.verified
        );
      }
    }

    return filteredArtifacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addTranslation(artifactId: string, language: string, translation: string, translatorId: string): Promise<void> {
    const artifact = this.artifacts.find(a => a.id === artifactId);
    if (!artifact) throw new Error('Artifact not found');

    artifact.translations[language] = {
      text: translation,
      translator: translatorId,
      verified: false
    };

    artifact.updatedAt = new Date();
    await offlineStorageService.storeOfflineData(artifact, 'cultural');
  }

  async addComment(artifactId: string, authorId: string, authorName: string, content: string, culturalInsight?: string): Promise<void> {
    const artifact = this.artifacts.find(a => a.id === artifactId);
    if (!artifact) throw new Error('Artifact not found');

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authorId,
      authorName,
      content,
      culturalInsight,
      timestamp: new Date(),
      replies: []
    };

    artifact.interactions.comments.push(comment);
    artifact.updatedAt = new Date();
    await offlineStorageService.storeOfflineData(artifact, 'cultural');
  }

  // Global Collaboration Projects
  async createCollaborationProject(project: Omit<GlobalCollaborationProject, 'id' | 'status' | 'impact'>): Promise<string> {
    const newProject: GlobalCollaborationProject = {
      ...project,
      id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'planning',
      impact: {
        studentsInvolved: project.participatingSchools.reduce((sum, school) => sum + school.students.length, 0),
        culturesRepresented: project.participatingSchools.length,
        artifactsCreated: 0,
        crossCulturalUnderstanding: 0
      }
    };

    this.collaborationProjects.push(newProject);
    await offlineStorageService.storeOfflineData(newProject, 'resource');
    
    return newProject.id;
  }

  getCollaborationProjects(filters?: {
    status?: GlobalCollaborationProject['status'];
    theme?: string;
    schoolId?: string;
  }): GlobalCollaborationProject[] {
    let projects = this.collaborationProjects;

    if (filters) {
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.theme) {
        projects = projects.filter(p => 
          p.theme.toLowerCase().includes(filters.theme!.toLowerCase())
        );
      }
      if (filters.schoolId) {
        projects = projects.filter(p => 
          p.participatingSchools.some(school => school.schoolId === filters.schoolId)
        );
      }
    }

    return projects.sort((a, b) => b.timeline.startDate.getTime() - a.timeline.startDate.getTime());
  }

  async joinCollaborationProject(projectId: string, schoolInfo: GlobalCollaborationProject['participatingSchools'][0]): Promise<boolean> {
    const project = this.collaborationProjects.find(p => p.id === projectId);
    if (!project || project.status !== 'planning') return false;

    // Check if school is already participating
    if (project.participatingSchools.some(school => school.schoolId === schoolInfo.schoolId)) {
      return false;
    }

    project.participatingSchools.push(schoolInfo);
    project.impact.studentsInvolved += schoolInfo.students.length;
    project.impact.culturesRepresented = project.participatingSchools.length;

    await offlineStorageService.storeOfflineData(project, 'resource');
    return true;
  }

  // Cultural Exchange Sessions
  async scheduleExchangeSession(session: Omit<CulturalExchangeSession, 'id' | 'feedback'>): Promise<string> {
    const newSession: CulturalExchangeSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feedback: {
        rating: 0,
        comments: [],
        culturalLearningValue: 0,
        engagementLevel: 0
      }
    };

    this.exchangeSessions.push(newSession);
    await offlineStorageService.storeOfflineData(newSession, 'resource');
    
    return newSession.id;
  }

  getExchangeSessions(filters?: {
    upcoming?: boolean;
    sessionType?: CulturalExchangeSession['sessionType'];
    culturalFocus?: string;
  }): CulturalExchangeSession[] {
    let sessions = this.exchangeSessions;

    if (filters) {
      if (filters.upcoming !== undefined) {
        const now = new Date();
        if (filters.upcoming) {
          sessions = sessions.filter(s => s.scheduledTime > now);
        } else {
          sessions = sessions.filter(s => s.scheduledTime <= now);
        }
      }
      if (filters.sessionType) {
        sessions = sessions.filter(s => s.sessionType === filters.sessionType);
      }
      if (filters.culturalFocus) {
        sessions = sessions.filter(s => 
          s.culturalFocus.toLowerCase().includes(filters.culturalFocus!.toLowerCase())
        );
      }
    }

    return sessions.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  // Analytics and Insights
  getCulturalAnalytics(): {
    totalArtifacts: number;
    artifactsByCategory: Record<string, number>;
    regionRepresentation: Record<string, number>;
    preservationUrgency: Record<string, number>;
    verificationStatus: Record<string, number>;
    activeCollaborations: number;
    culturalExchanges: number;
    globalReach: {
      countries: number;
      languages: number;
      communities: number;
    };
  } {
    const artifactsByCategory: Record<string, number> = {};
    const regionRepresentation: Record<string, number> = {};
    const preservationUrgency: Record<string, number> = {};
    const verificationStatus: Record<string, number> = {};

    this.artifacts.forEach(artifact => {
      // Category distribution
      artifactsByCategory[artifact.category] = (artifactsByCategory[artifact.category] || 0) + 1;
      
      // Region representation
      regionRepresentation[artifact.culturalOrigin.region] = (regionRepresentation[artifact.culturalOrigin.region] || 0) + 1;
      
      // Preservation urgency
      preservationUrgency[artifact.metadata.preservation_urgency] = (preservationUrgency[artifact.metadata.preservation_urgency] || 0) + 1;
      
      // Verification status
      verificationStatus[artifact.verification.status] = (verificationStatus[artifact.verification.status] || 0) + 1;
    });

    const uniqueCountries = new Set(this.artifacts.map(a => a.culturalOrigin.region));
    const uniqueLanguages = new Set(this.artifacts.map(a => a.culturalOrigin.language));
    const uniqueCommunities = new Set(this.artifacts.map(a => a.culturalOrigin.community));

    return {
      totalArtifacts: this.artifacts.length,
      artifactsByCategory,
      regionRepresentation,
      preservationUrgency,
      verificationStatus,
      activeCollaborations: this.collaborationProjects.filter(p => p.status === 'active').length,
      culturalExchanges: this.exchangeSessions.length,
      globalReach: {
        countries: uniqueCountries.size,
        languages: uniqueLanguages.size,
        communities: uniqueCommunities.size
      }
    };
  }

  getStudentCulturalContributions(studentId: string): {
    artifactsContributed: number;
    collaborationsJoined: number;
    exchangesAttended: number;
    translationsProvided: number;
    commentsShared: number;
    culturalImpactScore: number;
  } {
    const artifactsContributed = this.artifacts.filter(a => 
      a.contributors.some(c => c.id === studentId)
    ).length;

    const collaborationsJoined = this.collaborationProjects.filter(p => 
      p.participatingSchools.some(school => school.students.includes(studentId))
    ).length;

    const translationsProvided = this.artifacts.reduce((count, artifact) => {
      return count + Object.values(artifact.translations).filter(t => t.translator === studentId).length;
    }, 0);

    const commentsShared = this.artifacts.reduce((count, artifact) => {
      return count + artifact.interactions.comments.filter(c => c.authorId === studentId).length;
    }, 0);

    // Calculate cultural impact score
    const culturalImpactScore = (artifactsContributed * 10) + 
                               (collaborationsJoined * 15) + 
                               (translationsProvided * 5) + 
                               (commentsShared * 2);

    return {
      artifactsContributed,
      collaborationsJoined,
      exchangesAttended: 0, // Would need to track attendance
      translationsProvided,
      commentsShared,
      culturalImpactScore
    };
  }

  // Recommendations
  getCulturalRecommendations(studentId: string, interests: string[], culturalBackground: string): {
    recommendedArtifacts: CulturalArtifact[];
    recommendedProjects: GlobalCollaborationProject[];
    recommendedSessions: CulturalExchangeSession[];
  } {
    // Simple recommendation logic - in production, this would be more sophisticated
    const recommendedArtifacts = this.artifacts
      .filter(a => 
        interests.some(interest => 
          a.metadata.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        ) ||
        a.culturalOrigin.region !== culturalBackground // Expose to different cultures
      )
      .slice(0, 5);

    const recommendedProjects = this.collaborationProjects
      .filter(p => 
        p.status === 'planning' &&
        !p.participatingSchools.some(school => 
          school.students.includes(studentId)
        )
      )
      .slice(0, 3);

    const recommendedSessions = this.exchangeSessions
      .filter(s => s.scheduledTime > new Date())
      .slice(0, 3);

    return {
      recommendedArtifacts,
      recommendedProjects,
      recommendedSessions
    };
  }

  // Private helper methods
  private async loadStoredData(): Promise<void> {
    try {
      // In a real application, load from database
      this.artifacts = [];
      this.collaborationProjects = [];
      this.exchangeSessions = [];
    } catch (error) {
      console.error('Failed to load cultural data:', error);
    }
  }

  private async seedInitialArtifacts(): Promise<void> {
    // Seed some initial cultural artifacts for demonstration
    const sampleArtifacts = [
      {
        title: "Traditional Odia Folk Tales",
        description: "Collection of ancient stories from Odisha preserving wisdom and values",
        category: 'story' as const,
        culturalOrigin: {
          region: "Odisha, India",
          community: "Odia",
          language: "Odia",
          timeperiod: "Ancient"
        },
        content: {
          text: "Sample folk tale content...",
        },
        metadata: {
          tags: ["folklore", "wisdom", "ancient", "oral tradition"],
          difficulty: 'beginner' as const,
          ageGroup: "All ages",
          significance: "Preserves ancient wisdom and cultural values",
          preservation_urgency: 'high' as const
        },
        contributors: [{
          id: "elder_001",
          name: "Community Elder",
          role: 'creator' as const,
          culturalBackground: "Odia community"
        }],
        translations: {},
        educationalIntegration: {
          subjects: ["Literature", "Cultural Studies", "Ethics"],
          gradeLevel: ["Primary", "Secondary"],
          learningObjectives: ["Cultural awareness", "Moral values", "Language skills"],
          activities: []
        }
      }
      // Add more sample artifacts...
    ];

    for (const artifact of sampleArtifacts) {
      await this.submitCulturalArtifact(artifact);
    }
  }
}

export const culturalKnowledgeService = new CulturalKnowledgeService();