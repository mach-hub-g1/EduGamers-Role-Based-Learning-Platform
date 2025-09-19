"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Users, Globe, Video, Camera, 
  Music, Palette, Heart, Share2, MessageCircle,
  Calendar, Clock, Award, Star, MapPin,
  Search, Filter, Plus, Play, Pause
} from 'lucide-react';
import { 
  culturalKnowledgeService, 
  CulturalArtifact, 
  GlobalCollaborationProject,
  CulturalExchangeSession 
} from '@/lib/cultural-knowledge-service';

const CulturalPreservationHub: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [artifacts, setArtifacts] = useState<CulturalArtifact[]>([]);
  const [collaborationProjects, setCollaborationProjects] = useState<GlobalCollaborationProject[]>([]);
  const [exchangeSessions, setExchangeSessions] = useState<CulturalExchangeSession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [culturalAnalytics, setCulturalAnalytics] = useState<any>(null);

  useEffect(() => {
    initializeCulturalData();
  }, []);

  const initializeCulturalData = async () => {
    try {
      await culturalKnowledgeService.initialize();
      
      const allArtifacts = culturalKnowledgeService.getCulturalArtifacts();
      setArtifacts(allArtifacts);
      
      const projects = culturalKnowledgeService.getCollaborationProjects({ status: 'active' });
      setCollaborationProjects(projects);
      
      const sessions = culturalKnowledgeService.getExchangeSessions({ upcoming: true });
      setExchangeSessions(sessions);
      
      const analytics = culturalKnowledgeService.getCulturalAnalytics();
      setCulturalAnalytics(analytics);
    } catch (error) {
      console.error('Failed to initialize cultural data:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      story: <BookOpen className="w-4 h-4" />,
      song: <Music className="w-4 h-4" />,
      dance: <Video className="w-4 h-4" />,
      craft: <Palette className="w-4 h-4" />,
      recipe: <Heart className="w-4 h-4" />,
      tradition: <Users className="w-4 h-4" />,
      language: <Globe className="w-4 h-4" />,
      art: <Palette className="w-4 h-4" />
    };
    return icons[category as keyof typeof icons] || <BookOpen className="w-4 h-4" />;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[urgency as keyof typeof colors] || colors.low;
  };

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesCategory = selectedCategory === 'all' || artifact.category === selectedCategory;
    const matchesSearch = artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.culturalOrigin.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const studentContributions = culturalKnowledgeService.getStudentCulturalContributions(studentId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cultural Preservation Hub</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Contribute Knowledge
        </Button>
      </div>

      {/* Student Contributions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Artifacts Contributed</p>
                <p className="text-2xl font-bold">{studentContributions.artifactsContributed}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Global Collaborations</p>
                <p className="text-2xl font-bold">{studentContributions.collaborationsJoined}</p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Translations Provided</p>
                <p className="text-2xl font-bold">{studentContributions.translationsProvided}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cultural Impact Score</p>
                <p className="text-2xl font-bold">{studentContributions.culturalImpactScore}</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="artifacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="artifacts">Cultural Artifacts</TabsTrigger>
          <TabsTrigger value="collaborations">Global Projects</TabsTrigger>
          <TabsTrigger value="exchanges">Cultural Exchanges</TabsTrigger>
          <TabsTrigger value="analytics">Preservation Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="artifacts" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search cultural artifacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="story">Stories</option>
              <option value="song">Songs</option>
              <option value="dance">Dances</option>
              <option value="craft">Crafts</option>
              <option value="recipe">Recipes</option>
              <option value="tradition">Traditions</option>
              <option value="language">Language</option>
              <option value="art">Art</option>
            </select>
          </div>

          {/* Artifacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact) => (
              <Card key={artifact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(artifact.category)}
                      <CardTitle className="text-lg">{artifact.title}</CardTitle>
                    </div>
                    <Badge 
                      className={`text-xs ${getUrgencyColor(artifact.metadata.preservation_urgency)}`}
                    >
                      {artifact.metadata.preservation_urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{artifact.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {artifact.culturalOrigin.region} • {artifact.culturalOrigin.language}
                    </div>
                    <div className="text-xs text-gray-500">
                      Community: {artifact.culturalOrigin.community}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {artifact.metadata.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {artifact.interactions.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {artifact.interactions.comments.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {artifact.interactions.shares}
                      </span>
                    </div>
                    <Badge 
                      variant={artifact.verification.status === 'verified' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {artifact.verification.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium">Available Translations:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(artifact.translations).length > 0 ? (
                        Object.keys(artifact.translations).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No translations yet</span>
                      )}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Explore Artifact
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArtifacts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Artifacts Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button>Contribute First Artifact</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="collaborations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collaborationProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    <Badge variant="outline">{project.collaborationType.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {project.participatingSchools.length}
                      </div>
                      <div className="text-xs text-blue-700">Schools</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {project.impact.studentsInvolved}
                      </div>
                      <div className="text-xs text-green-700">Students</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Participating Schools:</div>
                    <div className="space-y-1">
                      {project.participatingSchools.slice(0, 3).map((school) => (
                        <div key={school.schoolId} className="text-xs text-gray-600 flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {school.schoolName} - {school.location}
                        </div>
                      ))}
                      {project.participatingSchools.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{project.participatingSchools.length - 3} more schools
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Timeline:</div>
                    <div className="text-xs text-gray-600">
                      {project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}
                    </div>
                    <Progress 
                      value={50} // This would be calculated based on completed milestones
                      className="h-2 mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recent Activities:</div>
                    {project.collaborationActivities.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="text-xs p-2 bg-gray-50 rounded">
                        <div className="font-medium">{activity.type.replace('_', ' ')}</div>
                        <div className="text-gray-600">
                          {activity.scheduledDate.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">Join Collaboration</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {collaborationProjects.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Collaborations</h3>
                <p className="text-gray-600 mb-4">
                  Start a global cultural collaboration project with schools worldwide
                </p>
                <Button>Create New Project</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exchangeSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                    </div>
                    <Badge variant="outline">{session.sessionType.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {session.scheduledTime.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-green-600" />
                      {session.duration} minutes
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Cultural Focus:</div>
                    <Badge variant="secondary">{session.culturalFocus}</Badge>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Presenter:</div>
                    <div className="text-sm text-gray-600">
                      {session.presenter.name} - {session.presenter.expertise}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.presenter.culturalBackground}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Interactive Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {session.interactiveElements.polls && (
                        <Badge variant="outline" className="text-xs">Polls</Badge>
                      )}
                      {session.interactiveElements.qna && (
                        <Badge variant="outline" className="text-xs">Q&A</Badge>
                      )}
                      {session.interactiveElements.breakoutRooms && (
                        <Badge variant="outline" className="text-xs">Breakout Rooms</Badge>
                      )}
                      {session.interactiveElements.sharedActivities && (
                        <Badge variant="outline" className="text-xs">Shared Activities</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">Join Session</Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {exchangeSessions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Exchanges</h3>
                <p className="text-gray-600 mb-4">
                  Cultural exchange sessions will appear here when scheduled
                </p>
                <Button>Schedule Exchange Session</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {culturalAnalytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Artifacts</p>
                        <p className="text-2xl font-bold">{culturalAnalytics.totalArtifacts}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Countries</p>
                        <p className="text-2xl font-bold">{culturalAnalytics.globalReach.countries}</p>
                      </div>
                      <Globe className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Languages</p>
                        <p className="text-2xl font-bold">{culturalAnalytics.globalReach.languages}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Projects</p>
                        <p className="text-2xl font-bold">{culturalAnalytics.activeCollaborations}</p>
                      </div>
                      <Star className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Artifacts by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(culturalAnalytics.artifactsByCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="capitalize">{category}</span>
                          </div>
                          <Badge variant="secondary">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preservation Urgency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(culturalAnalytics.preservationUrgency).map(([urgency, count]) => (
                        <div key={urgency} className="flex items-center justify-between">
                          <span className="capitalize">{urgency}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(count as number / culturalAnalytics.totalArtifacts) * 100} 
                              className="w-20 h-2"
                            />
                            <Badge 
                              variant="secondary"
                              className={getUrgencyColor(urgency)}
                            >
                              {count as number}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CulturalPreservationHub;