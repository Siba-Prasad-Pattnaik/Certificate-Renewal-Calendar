import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ActivityIcon, 
  UsersIcon, 
  EyeIcon, 
  MessageSquareIcon, 
  FileTextIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Portal',
  description: 'Admin dashboard with real-time analytics and status overview',
};

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center text-xs mt-2">
            <span className={`${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </span>
            <span className="text-muted-foreground ml-2">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusItemProps {
  label: string;
  count: number;
  status: 'success' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
}

function StatusItem({ label, count, status, icon }: StatusItemProps) {
  const statusColors = {
    success: 'bg-green-500/20 text-green-600 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-600 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${statusColors[status]}`}>
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      <Badge variant="outline" className={statusColors[status].replace('border-', '')}>
        {count}
      </Badge>
    </div>
  );
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Visitors',
      value: '2,847',
      description: 'Last 30 days',
      icon: <EyeIcon className="h-4 w-4" />,
      trend: { value: '+12.5%', isPositive: true },
    },
    {
      title: 'Contact Messages',
      value: '42',
      description: 'Awaiting response',
      icon: <MessageSquareIcon className="h-4 w-4" />,
      trend: { value: '+8.2%', isPositive: true },
    },
    {
      title: 'Published Projects',
      value: '12',
      description: 'Active projects',
      icon: <FileTextIcon className="h-4 w-4" />,
      trend: { value: '+2', isPositive: true },
    },
    {
      title: 'Active Sessions',
      value: '24',
      description: 'Current visitors',
      icon: <UsersIcon className="h-4 w-4" />,
      trend: { value: '+5', isPositive: true },
    },
  ];

  const statusItems = [
    {
      label: 'Published Blog Posts',
      count: 8,
      status: 'success' as const,
      icon: <CheckCircleIcon className="h-5 w-5" />,
    },
    {
      label: 'Draft Projects',
      count: 3,
      status: 'warning' as const,
      icon: <AlertCircleIcon className="h-5 w-5" />,
    },
    {
      label: 'Failed Form Submissions',
      count: 2,
      status: 'error' as const,
      icon: <XCircleIcon className="h-5 w-5" />,
    },
    {
      label: 'Pending Contact Responses',
      count: 5,
      status: 'info' as const,
      icon: <ClockIcon className="h-5 w-5" />,
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New project published', user: 'John Doe', time: '10 minutes ago' },
    { id: 2, action: 'Blog post updated', user: 'Jane Smith', time: '2 hours ago' },
    { id: 3, action: 'Contact message received', user: 'Anonymous', time: '5 hours ago' },
    { id: 4, action: 'Resume downloaded', user: 'Recruiter', time: '1 day ago' },
    { id: 5, action: 'Skills section updated', user: 'John Doe', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your portfolio analytics, content status, and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
              <CardDescription>Real-time status of your content and submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusItems.map((item, index) => (
                <StatusItem key={index} {...item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">by {activity.user}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <FileTextIcon className="h-6 w-6" />
              <span>Add Project</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <MessageSquareIcon className="h-6 w-6" />
              <span>View Messages</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <TrendingUpIcon className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <ActivityIcon className="h-6 w-6" />
              <span>Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}