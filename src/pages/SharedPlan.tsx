import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserPlans } from '@/hooks/use-user-plans';
import Header from '@/components/Header';
import { MapPin, Calendar, Users, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const SharedPlan: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const navigate = useNavigate();
  const { getPlanByShareToken } = useUserPlans();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareToken) {
      loadPlan();
    }
  }, [shareToken]);

  const loadPlan = async () => {
    if (!shareToken) return;
    
    setLoading(true);
    const { data, error } = await getPlanByShareToken(shareToken);
    
    if (error || !data) {
      toast({
        title: 'Plan not found',
        description: 'This plan may have been deleted or made private.',
        variant: 'destructive',
      });
      navigate('/');
    } else {
      setPlan(data);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.title,
          text: plan.description || 'Check out this amazing plan on Blitz!',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Plan link has been copied to your clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton title="Shared Plan" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton title="Plan Not Found" />
        <div className="flex flex-col items-center justify-center h-64 px-6">
          <h2 className="text-xl font-bold mb-2">Plan Not Found</h2>
          <p className="text-muted-foreground text-center mb-4">
            This plan may have been deleted or made private.
          </p>
          <Button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton title="Shared Plan" />
      
      <main className="px-6 py-8 max-w-md mx-auto">
        <div className="card-elevated rounded-2xl p-6 space-y-6">
          {/* Plan Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{plan.title}</h1>
            {plan.description && (
              <p className="text-muted-foreground">{plan.description}</p>
            )}
          </div>

          {/* Plan Details */}
          <div className="space-y-4">
            {plan.occasion && (
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-semibold">Occasion:</span>
                <span className="text-muted-foreground capitalize">{plan.occasion}</span>
              </div>
            )}

            {plan.timing && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold">When:</span>
                <span className="text-muted-foreground">
                  {new Date(plan.timing).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold">Distance:</span>
              <span className="text-muted-foreground">Within {plan.locality}km</span>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">Places:</span>
              <span className="text-muted-foreground">{plan.place_ids.length} selected</span>
            </div>
          </div>

          {/* Places List */}
          {plan.place_ids.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Places in this plan:</h3>
              <div className="space-y-2">
                {plan.place_ids.map((placeId: string, index: number) => (
                  <div key={placeId} className="card-spotify rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold">Place {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={() => navigate('/planner')}
              className="flex-1 btn-primary"
            >
              Create Similar Plan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedPlan;