import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { HealthData } from "./HealthQuestionnaire";

interface HealthSummaryProps {
  healthData: HealthData;
  userName: string;
  onContinueToRecipes: () => void;
}

export function HealthSummary({ healthData, userName, onContinueToRecipes }: HealthSummaryProps) {
  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Normal': return 'text-green-600 bg-green-100';
      case 'Overweight': case 'Obese': return 'text-red-600 bg-red-100';
      case 'Underweight': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-3xl">👤</span>
          </div>
          <h1 className="text-3xl text-gray-800 mb-2">Your Health Profile</h1>
          <p className="text-gray-600">Here's a summary of your health information, {firstName}</p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* Basic Information Card */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-blue-500">📏</span>
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{healthData.age}</div>
                  <div className="text-sm text-gray-600">Years Old</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{healthData.height.value}{healthData.height.unit}</div>
                  <div className="text-sm text-gray-600">Height</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{healthData.weight.value}{healthData.weight.unit}</div>
                  <div className="text-sm text-gray-600">Current Weight</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{healthData.targetWeight.value}{healthData.targetWeight.unit}</div>
                  <div className="text-sm text-gray-600">Target Weight</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BMI Card */}
          {healthData.bmi && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-green-500">📊</span>
                  <span>BMI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">{healthData.bmi}</div>
                  <Badge className={`${getBMIColor(healthData.bmiCategory || '')} px-4 py-2 rounded-full text-sm`}>
                    {healthData.bmiCategory}
                  </Badge>
                  <p className="text-gray-600 mt-4">
                    {healthData.bmiCategory === 'Normal' && "You're in the healthy weight range! Keep up the good work."}
                    {healthData.bmiCategory === 'Underweight' && "Consider gaining some healthy weight with nutritious meals."}
                    {healthData.bmiCategory === 'Overweight' && "A balanced diet can help you reach your ideal weight."}
                    {healthData.bmiCategory === 'Obese' && "Let's create a healthy meal plan to support your wellness journey."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allergies Card */}
          {(healthData.allergies.length > 0 || healthData.foodAllergies.length > 0) && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-orange-500">⚠️</span>
                  <span>Allergies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData.allergies.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">General Allergies:</div>
                      <div className="flex flex-wrap gap-2">
                        {healthData.allergies.map((allergy) => (
                          <Badge key={allergy} variant="secondary" className="rounded-full">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {healthData.foodAllergies.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Food Allergies:</div>
                      <div className="flex flex-wrap gap-2">
                        {healthData.foodAllergies.map((allergy) => (
                          <Badge key={allergy} variant="outline" className="rounded-full border-red-200 text-red-700">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Conditions Card */}
          {healthData.healthConditions.length > 0 && !healthData.healthConditions.includes('None') && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-red-500">🏥</span>
                  <span>Health Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {healthData.healthConditions.filter(c => c !== 'None').map((condition) => (
                    <Badge key={condition} variant="outline" className="rounded-full border-blue-200 text-blue-700">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center">
          <Button
            onClick={onContinueToRecipes}
            className="w-full max-w-md h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transition-all duration-300 transform hover:scale-[1.02]"
          >
            Continue to Recipes
          </Button>
        </div>
      </div>
    </div>
  );
}