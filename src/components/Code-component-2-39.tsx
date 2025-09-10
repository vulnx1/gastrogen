import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HealthData } from "./HealthQuestionnaire";
import { 
  AlertTriangle, 
  Phone, 
  X, 
  Heart, 
  Scale, 
  Activity,
  ExternalLink,
  Clock
} from "lucide-react";

interface EmergencyAlertsProps {
  healthData: HealthData;
  onDismiss: () => void;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  icon: React.ComponentType<any>;
  dismissible: boolean;
}

export function EmergencyAlerts({ healthData, onDismiss }: EmergencyAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // Critical BMI alerts
    if (healthData.bmi && healthData.bmi < 16) {
      alerts.push({
        id: 'severe-underweight',
        type: 'critical',
        title: 'Severe Underweight Alert',
        message: `Your BMI of ${healthData.bmi} indicates severe underweight. Please consult a healthcare professional immediately.`,
        actions: [
          {
            label: 'Find Doctor',
            action: () => window.open('https://www.healthgrades.com/find-a-doctor', '_blank'),
            variant: 'destructive'
          },
          {
            label: 'Emergency',
            action: () => window.open('tel:911'),
            variant: 'destructive'
          }
        ],
        icon: AlertTriangle,
        dismissible: false
      });
    }

    if (healthData.bmi && healthData.bmi > 40) {
      alerts.push({
        id: 'severe-obesity',
        type: 'critical',
        title: 'Severe Obesity Alert',
        message: `Your BMI of ${healthData.bmi} indicates severe obesity. Immediate medical consultation is recommended.`,
        actions: [
          {
            label: 'Find Specialist',
            action: () => window.open('https://www.healthgrades.com/find-a-doctor', '_blank'),
            variant: 'destructive'
          },
          {
            label: 'Emergency',
            action: () => window.open('tel:911'),
            variant: 'destructive'
          }
        ],
        icon: Scale,
        dismissible: false
      });
    }

    // Health condition alerts
    if (healthData.healthConditions.includes('Heart Disease')) {
      alerts.push({
        id: 'heart-condition',
        type: 'warning',
        title: 'Heart Health Monitoring',
        message: 'Due to your heart condition, we recommend regular monitoring and medical follow-ups.',
        actions: [
          {
            label: 'Find Cardiologist',
            action: () => window.open('https://www.healthgrades.com/cardiology', '_blank')
          },
          {
            label: 'Heart-Healthy Recipes',
            action: () => console.log('Navigate to heart-healthy recipes')
          }
        ],
        icon: Heart,
        dismissible: true
      });
    }

    if (healthData.healthConditions.includes('Diabetes')) {
      alerts.push({
        id: 'diabetes-alert',
        type: 'warning',
        title: 'Diabetes Management',
        message: 'Regular blood sugar monitoring and diabetic-friendly meal planning is crucial for your health.',
        actions: [
          {
            label: 'Find Endocrinologist',
            action: () => window.open('https://www.healthgrades.com/endocrinology', '_blank')
          },
          {
            label: 'Diabetic Recipes',
            action: () => console.log('Navigate to diabetic recipes')
          }
        ],
        icon: Activity,
        dismissible: true
      });
    }

    if (healthData.healthConditions.includes('High Blood Pressure')) {
      alerts.push({
        id: 'blood-pressure',
        type: 'warning',
        title: 'Blood Pressure Monitoring',
        message: 'Your high blood pressure requires careful monitoring and lifestyle management.',
        actions: [
          {
            label: 'Find Doctor',
            action: () => window.open('https://www.healthgrades.com/find-a-doctor', '_blank')
          },
          {
            label: 'Low-Sodium Recipes',
            action: () => console.log('Navigate to low-sodium recipes')
          }
        ],
        icon: Heart,
        dismissible: true
      });
    }

    // Warning for extreme weight goals
    if (healthData.targetWeight.value && healthData.weight.value) {
      const weightDiff = Math.abs(healthData.weight.value - healthData.targetWeight.value);
      const percentDiff = (weightDiff / healthData.weight.value) * 100;
      
      if (percentDiff > 30) {
        alerts.push({
          id: 'extreme-weight-goal',
          type: 'warning',
          title: 'Extreme Weight Goal Warning',
          message: 'Your target weight represents a significant change. Please consult a healthcare professional for a safe plan.',
          actions: [
            {
              label: 'Find Nutritionist',
              action: () => window.open('https://www.eatright.org/find-an-expert', '_blank')
            },
            {
              label: 'Adjust Goal',
              action: () => console.log('Navigate to health questionnaire')
            }
          ],
          icon: Target,
          dismissible: true
        });
      }
    }

    return alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  };

  const alerts = generateAlerts();

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50/95 dark:bg-red-950/95',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50/95 dark:bg-orange-950/95',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          title: 'text-orange-800 dark:text-orange-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-50/95 dark:bg-blue-950/95',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-200'
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20">
      <div className="w-full max-w-md space-y-4">
        <AnimatePresence>
          {alerts.map((alert) => {
            const colors = getAlertColors(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="relative"
              >
                <Card className={`${colors.bg} ${colors.border} border-2 backdrop-blur-2xl shadow-2xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-xl bg-white/30 dark:bg-black/30 ${
                        alert.type === 'critical' ? 'animate-pulse' : ''
                      }`}>
                        <alert.icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 ${colors.title}`}>
                          {alert.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                          {alert.message}
                        </p>
                        
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.variant || 'default'}
                                onClick={action.action}
                                className={`rounded-lg ${
                                  action.variant === 'destructive' 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : action.variant === 'outline'
                                    ? 'border-current bg-white/20 hover:bg-white/30'
                                    : 'bg-white/30 hover:bg-white/40 text-gray-800 dark:text-gray-200'
                                }`}
                              >
                                {action.label}
                                {action.label.includes('Find') && (
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                )}
                                {action.label === 'Emergency' && (
                                  <Phone className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Health Alert • {new Date().toLocaleTimeString()}</span>
                          </div>
                          {alert.type === 'critical' && (
                            <span className="flex items-center space-x-1 text-red-600 dark:text-red-400 font-medium">
                              <AlertTriangle className="w-3 h-3" />
                              <span>URGENT</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {alert.dismissible && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(alert.id)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-white/20 dark:hover:bg-black/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}