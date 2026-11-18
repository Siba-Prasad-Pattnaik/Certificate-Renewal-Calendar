import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, GripVertical, Save, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Education Management | Admin Dashboard',
  description: 'Manage education history and qualifications',
}

// Mock education items - in a real app, this would come from your API
const mockEducationItems = [
  {
    id: '1',
    institution: 'Stanford University',
    degree: 'Master of Science in Computer Science',
    field: 'Computer Science',
    startDate: '2018-09',
    endDate: '2020-06',
    grade: 'GPA: 3.9/4.0',
    description: 'Specialized in machine learning and distributed systems. Thesis on federated learning.',
    order: 1,
  },
  {
    id: '2',
    institution: 'MIT',
    degree: 'Bachelor of Science in Computer Science',
    field: 'Computer Science',
    startDate: '2014-09',
    endDate: '2018-05',
    grade: 'Summa Cum Laude',
    description: 'Concentration in artificial intelligence and human-computer interaction.',
    order: 2,
  },
  {
    id: '3',
    institution: 'Google Developer Certification',
    degree: 'Professional Cloud Architect',
    field: 'Cloud Computing',
    startDate: '2021-03',
    endDate: '2021-06',
    grade: 'Certified',
    description: 'Certified in designing, developing, and managing cloud solutions using Google Cloud Platform.',
    order: 3,
  },
]

export default function EducationPage() {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = mockEducationItems
    
    switch (e.key) {
      case ' ':
        e.preventDefault()
        // Announce grab
        const item = items[index]
        const announcement = `Grabbed ${item.institution} - ${item.degree}. Press arrow keys to move, Space to drop, or Escape to cancel.`
        announceToScreenReader(announcement)
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (index > 0) {
          // Move item up
          const fromPosition = index + 1
          const toPosition = index
          const item = items[index]
          const announcement = `${item.institution} moved from position ${fromPosition} to position ${toPosition} of ${items.length}`
          announceToScreenReader(announcement)
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (index < items.length - 1) {
          // Move item down
          const fromPosition = index + 1
          const toPosition = index + 2
          const item = items[index]
          const announcement = `${item.institution} moved from position ${fromPosition} to position ${toPosition} of ${items.length}`
          announceToScreenReader(announcement)
        }
        break
        
      case 'Escape':
        e.preventDefault()
        announceToScreenReader('Drag cancelled')
        break
    }
  }

  const handleDrop = (fromIndex: number, toIndex: number) => {
    const item = mockEducationItems[fromIndex]
    const fromPosition = fromIndex + 1
    const toPosition = toIndex + 1
    const announcement = `${item.institution} moved from position ${fromPosition} to position ${toPosition} of ${mockEducationItems.length}`
    announceToScreenReader(announcement)
  }

  const announceToScreenReader = (message: string) => {
    // In a real app, you would use a proper live region component
    // This is simplified for demonstration
    const liveRegion = document.getElementById('education-live-region')
    if (liveRegion) {
      liveRegion.textContent = message
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Education Management</h1>
          <p className="text-muted-foreground">
            Manage education history and qualifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>
      </div>

      {/* Live region for screen reader announcements */}
      <div 
        id="education-live-region"
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      >
        {/* Announcements will be inserted here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education Items</CardTitle>
              <CardDescription>
                Drag to reorder education history. Items at the top appear first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEducationItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    draggable
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    role="listitem"
                    aria-label={`${item.institution} - ${item.degree}. Position ${index + 1} of ${mockEducationItems.length}. Press Space to grab and move with arrow keys.`}
                  >
                    <button
                      type="button"
                      className="p-2 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
                      aria-label={`Drag handle for ${item.institution}`}
                      tabIndex={-1}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.institution}</h3>
                          <p className="text-muted-foreground">{item.degree}</p>
                          {item.field && (
                            <p className="text-sm text-muted-foreground mt-1">{item.field}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.startDate} - {item.endDate}</p>
                          <p className="text-sm text-muted-foreground">{item.grade}</p>
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        <div className="flex-1" />
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Move ${item.institution} up`}
                            onClick={() => handleDrop(index, index - 1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {index < mockEducationItems.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Move ${item.institution} down`}
                            onClick={() => handleDrop(index, index + 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Education</CardTitle>
              <CardDescription>
                Enter details for new education entry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="institution" className="text-sm font-medium">
                  Institution
                </label>
                <Input
                  id="institution"
                  placeholder="University name"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="degree" className="text-sm font-medium">
                  Degree
                </label>
                <Input
                  id="degree"
                  placeholder="Bachelor of Science in Computer Science"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="field" className="text-sm font-medium">
                  Field of Study
                </label>
                <Input
                  id="field"
                  placeholder="Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="month"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="month"
                    placeholder="Present"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="grade" className="text-sm font-medium">
                  Grade/Certification
                </label>
                <Input
                  id="grade"
                  placeholder="GPA: 3.9/4.0 or Certified"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Brief description of achievements, coursework, or thesis"
                  rows={4}
                />
              </div>

              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Navigation for reordering items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Space</span>
                <span className="text-sm text-muted-foreground">Grab/Drop item</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Arrow Up/Down</span>
                <span className="text-sm text-muted-foreground">Move item</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Escape</span>
                <span className="text-sm text-muted-foreground">Cancel drag</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tab</span>
                <span className="text-sm text-muted-foreground">Navigate between items</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>Drag and drop to reorder education history</p>
          <p>Changes are automatically saved</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}