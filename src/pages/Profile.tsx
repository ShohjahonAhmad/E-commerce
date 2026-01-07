import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User } from 'lucide-react';

function ProfileContent() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    setIsSaving(true);
    const { error } = await updateProfile({ display_name: displayName.trim() });
    setIsSaving(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">
            My Profile
          </h1>

          <div className="bg-card rounded-sm shadow-soft p-6 md:p-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xl bg-secondary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium">
                  {profile?.display_name || 'User'}
                </h2>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.role || 'Member'}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-muted-foreground">
                  Email
                </Label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                {isEditing ? (
                  <div className="mt-1 space-y-3">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(profile?.display_name || '');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm">
                      {profile?.display_name || 'Not set'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-muted-foreground">Account Type</Label>
                <p className="mt-1 text-sm capitalize">{profile?.role}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Member Since</Label>
                <p className="mt-1 text-sm">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
