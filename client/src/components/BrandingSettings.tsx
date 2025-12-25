import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Palette, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandingSettings() {
  const [companyName, setCompanyName] = useState('BlueAlly');
  const [reportTitle, setReportTitle] = useState('AI Transformation Dashboard');
  const [primaryColor, setPrimaryColor] = useState('#0047bb');
  const [showLogo, setShowLogo] = useState(true);

  const handleExportPDF = () => {
    toast.info('PDF export functionality coming soon!', {
      description: 'This will generate a branded PDF report with all dashboard data'
    });
  };

  const handleExportExcel = () => {
    toast.info('Excel export functionality coming soon!', {
      description: 'This will export all use case data and calculations to Excel'
    });
  };

  const handleExportPresentation = () => {
    toast.info('PowerPoint export functionality coming soon!', {
      description: 'This will create a branded presentation deck with key insights'
    });
  };

  return (
    <div className="space-y-6">
      {/* Branding Customization */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Custom Branding</CardTitle>
          </div>
          <CardDescription>
            Customize the dashboard branding for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportTitle">Report Title</Label>
              <Input
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#cd040b"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo Display</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="showLogo" className="text-sm font-medium">
                  Show company logo in exports
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Preview</h4>
                <p className="text-sm text-muted-foreground">
                  Current branding: <strong>{companyName}</strong> - {reportTitle}
                </p>
              </div>
              {showLogo && (
                <img 
                  src="/images/blueally-logo.jpg" 
                  alt="Company Logo" 
                  className="h-8 object-contain"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <CardTitle>Export Options</CardTitle>
          </div>
          <CardDescription>
            Download dashboard data and reports in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">PDF Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Comprehensive executive summary with all charts and metrics
                </p>
                <Button onClick={handleExportPDF} className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Excel Workbook</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  All use case data, calculations, and financial projections
                </p>
                <Button onClick={handleExportExcel} className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">PowerPoint Deck</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Executive presentation with key insights and visualizations
                </p>
                <Button onClick={handleExportPresentation} className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PPT
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Export Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Custom branding with company logo and colors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>All financial calculations and projections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>High-resolution charts and visualizations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Executive summary and detailed use case breakdowns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Scenario analysis and sensitivity data</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* BlueAlly Brand Guidelines */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img src="/images/blueally-logo.jpg" alt="BlueAlly" className="h-6 rounded-full" />
            BlueAlly Brand Guidelines
          </CardTitle>
          <CardDescription>
            Official BlueAlly branding applied to this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Primary Colors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border" style={{ backgroundColor: '#0047bb' }}></div>
                  <div>
                    <div className="font-medium">BlueAlly Blue</div>
                    <div className="text-xs text-muted-foreground">#0047bb</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border" style={{ backgroundColor: '#000000' }}></div>
                  <div>
                    <div className="font-medium">Black</div>
                    <div className="text-xs text-muted-foreground">#000000</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Typography</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-semibold">Primary: IBM Plex Sans</div>
                  <div className="text-muted-foreground">Used for headings and emphasis</div>
                </div>
                <div>
                  <div className="font-semibold">Secondary: Inter</div>
                  <div className="text-muted-foreground">Used for body text and data</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              This dashboard follows BlueAlly's official brand guidelines to ensure consistency 
              with corporate identity standards. All exports will maintain these brand standards 
              for professional presentations and reports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
