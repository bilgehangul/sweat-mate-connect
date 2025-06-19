import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { X, Crown, Shield, Users, Trash2, UserMinus, Settings } from 'lucide-react';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useCommunityManagement } from '@/hooks/useCommunityManagement';
import { useToast } from '@/hooks/use-toast';

interface CommunityManagementModalProps {
  community: {
    id: string;
    name: string;
    creator_id: string;
    is_private: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const CommunityManagementModal = ({ community, isOpen, onClose, onUpdate }: CommunityManagementModalProps) => {
  const { members, userRole, loading, refetch } = useCommunityMembers(community.id);
  const { transferOwnership, updateMemberRole, deleteCommunity, leaveCommunityWithReason, loading: actionLoading } = useCommunityManagement();
  const { toast } = useToast();
  
  const [selectedNewOwner, setSelectedNewOwner] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  if (!isOpen) return null;

  const isOwner = userRole === 'admin' && members.find(m => m.user_id === community.creator_id)?.user_id === members.find(m => m.role === 'admin')?.user_id;
  const canManageMembers = userRole === 'admin' || userRole === 'moderator';

  const handleTransferOwnership = async () => {
    if (!selectedNewOwner) return;
    
    try {
      await transferOwnership(community.id, selectedNewOwner);
      toast({
        title: "Ownership transferred successfully",
        description: "The community ownership has been transferred.",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error transferring ownership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'moderator' | 'member') => {
    try {
      await updateMemberRole(community.id, userId, newRole);
      toast({
        title: "Role updated successfully",
        description: "Member role has been updated.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      await deleteCommunity(community.id);
      toast({
        title: "Community deleted",
        description: "The community has been permanently deleted.",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error deleting community",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveCommunity = async () => {
    if (!leaveReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for leaving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await leaveCommunityWithReason(community.id, leaveReason);
      toast({
        title: "Left community",
        description: "You have successfully left the community.",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error leaving community",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Manage {community.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Community Members ({members.length})</h3>
                
                {loading ? (
                  <div className="text-center py-4">Loading members...</div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => {
                      const displayName = member.profiles.first_name && member.profiles.last_name
                        ? `${member.profiles.first_name} ${member.profiles.last_name}`
                        : member.profiles.username || 'Unknown User';

                      return (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                              {member.profiles.avatar_url ? (
                                <img 
                                  src={member.profiles.avatar_url} 
                                  alt="Avatar" 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold">
                                  {displayName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.profiles.experience_level || 'Beginner'} • Joined {new Date(member.joined_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getRoleBadgeColor(member.role)} flex items-center gap-1`}>
                              {getRoleIcon(member.role)}
                              {member.role}
                            </Badge>
                            
                            {canManageMembers && member.user_id !== community.creator_id && (
                              <Select
                                value={member.role}
                                onValueChange={(newRole) => handleRoleUpdate(member.user_id, newRole as any)}
                                disabled={actionLoading}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">Member</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {isOwner && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Transfer Ownership</h3>
                  <p className="text-muted-foreground">
                    Transfer ownership of this community to another admin member.
                  </p>
                  
                  <div className="space-y-3">
                    <Label>Select New Owner</Label>
                    <Select value={selectedNewOwner} onValueChange={setSelectedNewOwner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a new owner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter(m => m.role === 'admin' && m.user_id !== community.creator_id)
                          .map((member) => {
                            const displayName = member.profiles.first_name && member.profiles.last_name
                              ? `${member.profiles.first_name} ${member.profiles.last_name}`
                              : member.profiles.username || 'Unknown User';
                            
                            return (
                              <SelectItem key={member.user_id} value={member.user_id}>
                                {displayName}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          disabled={!selectedNewOwner || actionLoading}
                          className="w-full"
                        >
                          Transfer Ownership
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to transfer ownership of this community? This action cannot be undone.
                            You will become an admin member instead.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleTransferOwnership}>
                            Transfer Ownership
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <div className="space-y-6">
                {/* Leave Community */}
                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Leave Community</h3>
                  <p className="text-muted-foreground mb-4">
                    {isOwner 
                      ? "As the owner, you must transfer ownership or delete the community before leaving."
                      : "Leave this community. You can rejoin later if it's public or get invited again."
                    }
                  </p>
                  
                  {!isOwner && (
                    <>
                      {!showLeaveForm ? (
                        <Button 
                          variant="outline" 
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => setShowLeaveForm(true)}
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Leave Community
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Label>Reason for leaving (required)</Label>
                          <Textarea
                            value={leaveReason}
                            onChange={(e) => setLeaveReason(e.target.value)}
                            placeholder="Please tell us why you're leaving..."
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={handleLeaveCommunity}
                              disabled={!leaveReason.trim() || actionLoading}
                            >
                              Confirm Leave
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowLeaveForm(false);
                                setLeaveReason('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Delete Community */}
                {isOwner && (
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Community</h3>
                    <p className="text-muted-foreground mb-4">
                      Permanently delete this community. This action cannot be undone and will remove all posts, 
                      members, and data associated with this community.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Community
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Community</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you absolutely sure you want to delete "{community.name}"? 
                            This action cannot be undone and will permanently remove all community data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteCommunity}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Community
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default CommunityManagementModal;