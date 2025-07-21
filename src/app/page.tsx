export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            BudgetMe
          </h1>
          <p className="text-xl text-neutral mb-8">
            Take control of your personal finances
          </p>
          <div className="space-x-4">
            <a 
              href="/setup" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Setup Required
            </a>
            <p className="text-sm text-neutral mt-4">
              Configure Supabase to get started
            </p>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
            <p className="text-neutral">Upload bank statements and automatically categorize transactions</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              🎯
            </div>
            <h3 className="text-lg font-semibold mb-2">Set Budgets</h3>
            <p className="text-neutral">Create monthly budgets and monitor your spending habits</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              📱
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-neutral">Access your budget data anywhere on any device</p>
          </div>
        </div>
      </div>
    </main>
  )
}