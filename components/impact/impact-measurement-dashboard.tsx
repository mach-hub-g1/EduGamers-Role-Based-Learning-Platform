"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, TrendingUp, Users, Globe, Award, 
  Plus, CheckCircle, Trophy, Heart,
  BarChart3, Activity, Clock
} from 'lucide-react';
import { 
  sdgImpactService, 
  SDGGoal, 
  StudentImpactContribution, 
  RealWorldProject,
  ImpactAnalytics 
} from '@/lib/sdg-impact-service';

const ImpactMeasurementDashboard: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [sdgGoals, setSDGGoals] = useState<SDGGoal[]>([]);
  const [studentContributions, setStudentContributions] = useState<StudentImpactContribution[]>([]);
  const [realWorldProjects, setRealWorldProjects] = useState<RealWorldProject[]>([]);
  const [communityAnalytics, setCommunityAnalytics] = useState<ImpactAnalytics | null>(null);

  useEffect(() => {
    initializeImpactData();
  }, [studentId]);

  const initializeImpactData = async () => {
    try {
      await sdgImpactService.initialize();
      
      const goals = sdgImpactService.getSDGGoals();
      setSDGGoals(goals);
      
      const contributions = sdgImpactService.getStudentContributions(studentId);
      setStudentContributions(contributions);
      
      const projects = sdgImpactService.getRealWorldProjects({ status: 'active' });
      setRealWorldProjects(projects);
      
      const analytics = sdgImpactService.getCommunityImpactAnalytics();
      setCommunityAnalytics(analytics);
    } catch (error) {
      console.error('Failed to initialize impact data:', error);
    }
  };

  const getSDGColor = (sdgId: number): string => {
    const goal = sdgGoals.find(g => g.id === sdgId);
    return goal?.color || '#666666';
  };

  const studentAnalytics = sdgImpactService.getStudentImpactAnalytics(studentId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SDG Impact Dashboard</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Report Impact
        </Button>
      </div>

      {/* Student Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                <p className="text-2xl font-bold">{studentAnalytics.totalContributions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">People Impacted</p>
                <p className="text-2xl font-bold">{studentAnalytics.totalPeopleImpacted.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SDG Goals</p>
                <p className="text-2xl font-bold">{studentAnalytics.sdgGoalsContributed.length}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Impact</p>
                <p className="text-2xl font-bold">{studentAnalytics.verifiedContributions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sdg-goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sdg-goals">SDG Goals</TabsTrigger>
          <TabsTrigger value="my-impact">My Impact</TabsTrigger>
          <TabsTrigger value="projects">Real-World Projects</TabsTrigger>
          <TabsTrigger value="analytics">Community Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sdg-goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Sustainable Development Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdgGoals.slice(0, 9).map((goal) => (
                  <div 
                    key={goal.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    style={{ borderColor: goal.color }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: goal.color }}
                        >
                          {goal.id}
                        </div>
                        <span className="text-2xl">{goal.icon}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {goal.studentContributions} contributions
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-sm">{goal.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-impact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {studentContributions.length > 0 ? studentContributions.map((contribution) => (
                <Card key={contribution.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">{contribution.projectTitle}</h3>
                        <p className="text-sm text-gray-600 mb-2">{contribution.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {contribution.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          contribution.verification.status === 'verified' ? 'default' :
                          contribution.verification.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {contribution.verification.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {contribution.metrics.peopleImpacted}
                        </div>
                        <div className="text-xs text-blue-700">People Impacted</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {contribution.metrics.resourcesSaved}
                        </div>
                        <div className="text-xs text-green-700">Resources Saved</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {contribution.metrics.awarenessRaised}
                        </div>
                        <div className="text-xs text-purple-700">Awareness Raised</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {contribution.metrics.innovationLevel}/10
                        </div>
                        <div className="text-xs text-orange-700">Innovation Level</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm capitalize">{contribution.impactType} Impact</span>
                        <Globe className="w-4 h-4" />
                        <span className="text-sm capitalize">{contribution.scope}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {contribution.sdgGoals.map(sdgId => (
                          <div 
                            key={sdgId}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: getSDGColor(sdgId) }}
                          >
                            {sdgId}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Impact Contributions Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start making a difference by reporting your first impact project!
                    </p>
                    <Button>Report Your First Impact</Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Impact Score</span>
                    <span className="font-semibold">{studentAnalytics.averageImpactScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Projects</span>
                    <span className="font-semibold">{studentAnalytics.culturalProjects}</span>
                  </div>
                  <div>
                    <div className="text-sm mb-2">Global Reach</div>
                    <div className="flex flex-wrap gap-1">
                      {studentAnalytics.globalReach.map(region => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {realWorldProjects.slice(0, 4).map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.currentParticipants.length}/{project.participantLimit}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.duration} days
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{project.difficulty}</Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">SDG Goals</div>
                      <div className="flex gap-1">
                        {project.sdgGoals.map(sdgId => (
                          <div 
                            key={sdgId}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: getSDGColor(sdgId) }}
                          >
                            {sdgId}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <Button className="w-full">Join Project</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {communityAnalytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold">{communityAnalytics.totalStudentsImpacted}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">People Impacted</p>
                        <p className="text-2xl font-bold">
                          {communityAnalytics.communityImpact.totalPeopleImpacted.toLocaleString()}
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Projects Completed</p>
                        <p className="text-2xl font-bold">{communityAnalytics.communityImpact.projectsCompleted}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contributions</p>
                        <p className="text-2xl font-bold">{communityAnalytics.totalContributions}</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityAnalytics.topPerformers.slice(0, 5).map((performer, index) => (
                      <div key={performer.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">Student {performer.studentId.slice(-8)}</div>
                            <div className="text-sm text-gray-600">
                              {performer.contributions} contributions • {performer.totalImpact} impact points
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {performer.sdgsFocused.slice(0, 3).map(sdgId => (
                            <div 
                              key={sdgId}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: getSDGColor(sdgId) }}
                            >
                              {sdgId}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImpactMeasurementDashboard;