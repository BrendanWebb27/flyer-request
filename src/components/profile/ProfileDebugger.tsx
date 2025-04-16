
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { checkForProfile, logAllProfiles } from '@/utils/profileUtils';

const ProfileDebugger: React.FC = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<string>('');
  const [showDebugger, setShowDebugger] = useState(false);
  
  const handleCheck = () => {
    const { exists, profile } = checkForProfile(username);
    if (exists) {
      setResult(`Profile found: ${JSON.stringify(profile, null, 2)}`);
    } else {
      setResult(`No profile found with username: ${username}`);
    }
  };
  
  const handleLogAll = () => {
    logAllProfiles();
    setResult('All profiles logged to console.');
  };
  
  // Check for the requested username on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug');
    const checkUsername = urlParams.get('check');
    
    if (debugMode === 'profile') {
      setShowDebugger(true);
    }
    
    if (checkUsername) {
      setUsername(checkUsername);
      const { exists, profile } = checkForProfile(checkUsername);
      if (exists) {
        setResult(`Profile found: ${JSON.stringify(profile, null, 2)}`);
      } else {
        setResult(`No profile found with username: ${checkUsername}`);
      }
    }
    
    // Check for specific username '69' since that was requested
    const specificCheck = '69';
    const { exists, profile } = checkForProfile(specificCheck);
    if (exists) {
      console.log(`[Profile Check] Profile with username "${specificCheck}" found:`, profile);
    } else {
      console.log(`[Profile Check] No profile found with username "${specificCheck}"`);
    }
  }, []);
  
  if (!showDebugger) {
    // Run the check automatically but don't show UI unless in debug mode
    return null;
  }
  
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Profile Debugger</CardTitle>
        <CardDescription>Check if a profile exists in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter username to check"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleCheck}>Check</Button>
            <Button variant="outline" onClick={handleLogAll}>Log All</Button>
          </div>
          {result && (
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-64">
              {result}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDebugger;
