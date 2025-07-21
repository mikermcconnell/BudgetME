export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🔧 Setup Required
          </h1>
          <p className="text-xl text-neutral mb-8">
            Please configure your Supabase connection to continue
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-sm border space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Step 1: Create a Supabase Project
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></li>
              <li>Sign in or create a free account</li>
              <li>Click "New Project"</li>
              <li>Choose your organization and fill in project details</li>
              <li>Wait for the project to be created (2-3 minutes)</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Step 2: Get Your Project Credentials
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral">
              <li>In your Supabase dashboard, go to Settings → API</li>
              <li>Copy the "Project URL" (starts with https://)</li>
              <li>Copy the "anon public" key (under "Project API keys")</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Step 3: Update Your Environment Variables
            </h2>
            <div className="bg-neutral/10 p-4 rounded-lg">
              <p className="text-sm text-neutral mb-2">Edit your <code className="bg-neutral/20 px-1 rounded">.env.local</code> file and replace:</p>
              <pre className="text-sm bg-black/10 p-3 rounded text-foreground overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`}
              </pre>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Step 4: Set Up the Database
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral">
              <li>In your Supabase dashboard, go to SQL Editor</li>
              <li>Copy the contents of <code className="bg-neutral/20 px-1 rounded">database/schema.sql</code></li>
              <li>Paste and run the SQL commands</li>
              <li>This will create all necessary tables and security policies</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Step 5: Restart the Development Server
            </h2>
            <div className="bg-neutral/10 p-4 rounded-lg">
              <p className="text-sm text-neutral mb-2">After updating your .env.local file, restart your development server:</p>
              <pre className="text-sm bg-black/10 p-3 rounded text-foreground">
{`# Stop the current server (Ctrl+C)
# Then restart:
npm run dev`}
              </pre>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-neutral">
            Once completed, refresh this page or visit{' '}
            <a href="/" className="text-primary hover:underline">the home page</a>
          </p>
        </div>
      </div>
    </div>
  )
}